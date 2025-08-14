import PdfPng from '@/static/pdf.png'
import WordPng from '@/static/word.png'
import ExcelPng from '@/static/excel.png'
import OtherPng from '@/static/other.png'

export const getFileName = (url) => {
  return url?.split('/').reduce((pre, next, index) => {
    return index <= 3 ? pre : pre + next
  }, '').replace(/(_\d{13})(\.\w+)$/, '$2')
}


type FileType = 'pdf' | 'word' | 'excel' | 'other'

const fileTypeMap: Record<FileType, string[]> = {
  pdf: ['pdf'],
  word: ['doc', 'docx', 'dot', 'dotx', 'rtf', 'odt', 'pages'],
  excel: ['xls', 'xlsx', 'xlsm', 'xlt', 'xltx', 'ods', 'csv'],
  other: []
}

const fileIconMap: Record<FileType, string> = {
  pdf: PdfPng,
  word: WordPng,
  excel: ExcelPng,
  other: OtherPng
}

/**
 * 根据文件后缀返回对应的图标
 * @param url 
 * @returns 
 */
export function getFileIcon(url?: string): string {
  const ext = url?.split('.').pop()?.toLowerCase() || ''
  for (const [type, exts] of Object.entries(fileTypeMap)) {
    if (exts.includes(ext)) {
      return fileIconMap[type as FileType]
    }
  }
  return fileIconMap.other
}