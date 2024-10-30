import React from 'react';
import { ReadonlyToolbarProps } from '../../types/analysis';
import { ZoomIn, ZoomOut, Download, RefreshCw } from 'lucide-react';
import { ANALYSIS_STYLES } from '../../styles/analysis';

const Toolbar: React.FC<ReadonlyToolbarProps> = ({
  onZoomIn,
  onZoomOut,
  onDownloadSvg,
  onDownloadPng,
  onResetView
}) => {
  const styles = ANALYSIS_STYLES.toolbar;

  return (
    <div className={styles.container}>
      <button
        onClick={onZoomIn}
        className={styles.button.icon}
        title="放大"
      >
        <ZoomIn className="w-5 h-5" />
      </button>
      <button
        onClick={onZoomOut}
        className={styles.button.icon}
        title="缩小"
      >
        <ZoomOut className="w-5 h-5" />
      </button>
      <button
        onClick={onResetView}
        className={styles.button.icon}
        title="重置视图"
      >
        <RefreshCw className="w-5 h-5" />
      </button>
      <div className={styles.divider} />
      <button
        onClick={onDownloadSvg}
        className={styles.button.download}
        title="下载 SVG"
      >
        <Download className="w-4 h-4" />
        SVG
      </button>
      <button
        onClick={onDownloadPng}
        className={styles.button.download}
        title="下载 PNG"
      >
        <Download className="w-4 h-4" />
        PNG
      </button>
    </div>
  );
};

export default Toolbar;