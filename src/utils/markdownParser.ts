import { ProcessNode, Pollutant } from '../types/svg';
import { POLLUTANT_TYPES, PollutantTypeKey, validatePollutantLabel } from '../constants/pollutantTypes';

interface ProcessSection {
  title: string;
  description: string;
  pollutants: PollutantSection[];
  level: number;
  startLine: number;
  endLine: number;
}

interface PollutantSection {
  id: string;
  type: PollutantTypeKey;
  label: string;
  description: string;
  parentProcess: string;
  lineNumber: number;
}

export class MarkdownParser {
  private currentSection: ProcessSection | null = null;
  private sections: ProcessSection[] = [];
  private debugInfo: string[] = [];

  public parseProcessFlow(markdown: string): ProcessNode[] {
    this.debugLog('==================== 开始解析流程 ====================');
    this.debugLog(`原始Markdown内容:\n${markdown}`);
    
    const lines = markdown.split('\n');
    this.debugLog(`总行数: ${lines.length}`);
    
    let inPollutantSection = false;
    let currentLevel = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const indentLevel = this.getIndentationLevel(lines[i]);
      
      this.debugLog(`\n行 ${i + 1} 分析:`);
      this.debugLog(`内容: "${line}"`);
      this.debugLog(`缩进级别: ${indentLevel}`);
      this.debugLog(`当前上下文: ${inPollutantSection ? '污染物部分' : '工序部分'}`);

      if (!line) {
        this.debugLog('空行 - 跳过');
        continue;
      }

      if (this.isProcessHeader(line)) {
        this.debugLog('发现新工序标题');
        if (this.currentSection) {
          this.currentSection.endLine = i - 1;
          this.debugLog(`结束上一工序节点: ${this.currentSection.title}`);
          this.debugLog(`节点范围: ${this.currentSection.startLine} - ${this.currentSection.endLine}`);
          this.sections.push(this.currentSection);
        }
        
        this.handleProcessHeader(line, i);
        inPollutantSection = false;
        currentLevel = 0;
        
      } else if (this.isDescriptionLine(line)) {
        this.debugLog('处理工艺描述');
        this.handleDescription(line);
        
      } else if (this.isPollutantsHeader(line)) {
        this.debugLog('进入污染物部分');
        inPollutantSection = true;
        currentLevel = indentLevel;
        
      } else if (inPollutantSection && this.isPollutantLine(line)) {
        this.debugLog('处理污染物条目');
        this.handlePollutant(line, i, indentLevel);
      }
    }

    // 处理最后一个节点
    if (this.currentSection) {
      this.currentSection.endLine = lines.length - 1;
      this.debugLog(`\n处理最后一个节点: ${this.currentSection.title}`);
      this.debugLog(`节点范围: ${this.currentSection.startLine} - ${this.currentSection.endLine}`);
      this.sections.push(this.currentSection);
    }

    const nodes = this.convertToProcessNodes();
    this.debugLog('\n==================== 解析完成 ====================');
    this.debugLog('最终解析结果:');
    this.debugLog(JSON.stringify(nodes, null, 2));
    
    // 输出完整的调试信息到控制台
    console.log(this.debugInfo.join('\n'));
    
    return nodes;
  }

  private getIndentationLevel(line: string): number {
    const match = line.match(/^(\s*)/);
    return match ? match[1].length : 0;
  }

  private debugLog(message: string) {
    const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
    this.debugInfo.push(`[${timestamp}] ${message}`);
  }

  private isProcessHeader(line: string): boolean {
    const isHeader = line.startsWith('### ');
    this.debugLog(`标题检查: "${line}" -> ${isHeader}`);
    return isHeader;
  }

  private isDescriptionLine(line: string): boolean {
    const isDesc = line.startsWith('- **工艺流程描述**');
    this.debugLog(`描述检查: "${line}" -> ${isDesc}`);
    return isDesc;
  }

  private isPollutantsHeader(line: string): boolean {
    const isPollutants = line === '- **污染物**';
    this.debugLog(`污染物标题检查: "${line}" -> ${isPollutants}`);
    return isPollutants;
  }

  private isPollutantLine(line: string): boolean {
    const pollutantPattern = Object.keys(POLLUTANT_TYPES)
      .map(type => `${type}\\d*`)
      .join('|');
    const pattern = new RegExp(`^\\s*-\\s*\\*\\*(${pollutantPattern})\\*\\*:`);
    const isPollutant = pattern.test(line);
    this.debugLog(`污染物行检查: "${line}" -> ${isPollutant}`);
    return isPollutant;
  }

  private handleProcessHeader(line: string, lineNumber: number): void {
    const title = line.replace('### ', '').replace(/^\d+\.\s*/, '').trim();
    this.currentSection = {
      title,
      description: '',
      pollutants: [],
      level: 1,
      startLine: lineNumber,
      endLine: -1
    };
    this.debugLog(`创建新工序节点: ${title}`);
    this.debugLog(`起始行: ${lineNumber}`);
  }

  private handleDescription(line: string): void {
    if (!this.currentSection) {
      this.debugLog('警告: 尝试添加描述但没有当前工序节点');
      return;
    }

    const description = line.replace(/^-\s*\*\*工艺流程描述\*\*[：:]\s*/, '').trim();
    this.currentSection.description = description;
    this.debugLog(`添加工艺描述: ${description}`);
  }

  private handlePollutant(line: string, lineNumber: number, indentLevel: number): void {
    if (!this.currentSection) {
      this.debugLog('警告: 尝试添加污染物但没有当前工序节点');
      return;
    }

    const match = line.match(/^\s*-\s*\*\*([GSWN]\d*)\*\*:\s*(.+)$/);
    if (!match) {
      this.debugLog(`警告: 污染物行格式不匹配: ${line}`);
      return;
    }

    const [, label, description] = match;
    if (!validatePollutantLabel(label)) {
      this.debugLog(`警告: 无效的污染物标签: ${label}`);
      return;
    }

    const type = label[0] as PollutantTypeKey;
    const pollutantInfo = POLLUTANT_TYPES[type];
    
    const pollutant: PollutantSection = {
      id: `pollutant-${label}`,
      type,
      label,
      description: description.trim(),
      parentProcess: this.currentSection.title,
      lineNumber
    };

    this.currentSection.pollutants.push(pollutant);
    this.debugLog(`添加污染物: ${JSON.stringify({
      ...pollutant,
      typeName: pollutantInfo.name,
      typeDescription: pollutantInfo.description
    })}`);
  }

  private convertToProcessNodes(): ProcessNode[] {
    this.debugLog('\n开始转换为最终节点格式');
    
    return this.sections.map((section, index) => {
      const node: ProcessNode = {
        id: `process-${index + 1}`,
        title: section.title,
        description: section.description,
        pollutants: section.pollutants.map(p => ({
          id: p.id,
          type: p.type,
          label: p.label,
          description: p.description
        }))
      };

      this.debugLog(`\n节点 ${index + 1} 转换完成:`);
      this.debugLog(`标题: ${node.title}`);
      this.debugLog(`描述: ${node.description}`);
      this.debugLog(`污染物数量: ${node.pollutants.length}`);
      node.pollutants.forEach((p, i) => {
        const typeInfo = POLLUTANT_TYPES[p.type];
        this.debugLog(`  污染物 ${i + 1}: ${p.label} (${typeInfo.name}) - ${p.description}`);
      });

      return node;
    });
  }
}