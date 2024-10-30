// Define readonly style constants
export const ANALYSIS_STYLES = Object.freeze({
  layout: Object.freeze({
    container: 'h-screen flex flex-col',
    header: 'bg-white shadow-sm px-4 py-2 flex items-center',
    backButton: 'flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors',
  }),
  
  sidebar: Object.freeze({
    container: 'h-full flex flex-col p-4 overflow-hidden transition-all duration-300',
    title: 'text-lg font-semibold mb-4',
    textarea: 'flex-1 p-3 border border-gray-300 rounded-lg resize-none mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent',
    button: {
      base: 'w-full px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 text-white font-medium transition-all duration-200',
      disabled: 'bg-gray-300 cursor-not-allowed',
      enabled: 'bg-blue-600 hover:bg-blue-700',
    },
  }),
  
  viewer: Object.freeze({
    container: 'h-full flex flex-col p-4 bg-white rounded-lg shadow-sm',
    content: 'flex-1 overflow-hidden bg-white rounded-lg shadow-inner mt-4 relative',
    placeholder: 'text-gray-400 absolute inset-0 flex items-center justify-center',
  }),
  
  toolbar: Object.freeze({
    container: 'flex items-center gap-2',
    button: {
      icon: 'p-2 hover:bg-gray-100 rounded-lg transition-colors',
      download: 'inline-flex items-center px-2.5 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors gap-1',
    },
    divider: 'w-px h-6 bg-gray-200 mx-2',
  }),
}) as const;