import React from 'react';
import { ReadonlySidebarProps } from '../../types/analysis';
import { FileCode, Loader2 } from 'lucide-react';
import { ANALYSIS_STYLES } from '../../styles/analysis';

const Sidebar = Object.freeze(React.memo(function Sidebar({
  content,
  isJsonFormat,
  onContentChange,
  onSubmit,
  isCollapsed,
  isLoading
}: ReadonlySidebarProps) {
  if (isCollapsed) return null;
  
  const styles = ANALYSIS_STYLES.sidebar;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>分析内容</h2>
      <textarea
        className={styles.textarea}
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder={isJsonFormat ? "JSON 格式内容..." : "分析内容..."}
        disabled={isLoading}
      />
      <button
        onClick={onSubmit}
        disabled={!content.trim() || isLoading}
        className={`
          ${styles.button.base}
          ${(!content.trim() || isLoading) ? styles.button.disabled : styles.button.enabled}
        `}
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <FileCode className="h-5 w-5" />
        )}
        生成 SVG
      </button>
    </div>
  );
}));

export default Sidebar;