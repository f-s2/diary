import { h } from "vue"

export function getPasswordDesc(record: PasswordStrategy.BasicInfo) {
  if (!record)
    return null

  const dataMap = new Map<keyof PasswordStrategy.ListItem, any[]>([
    ['passwordMinLength', ['最低', h('span', { style: { margin: '0 2px', color: 'rgb(248,113,113)' } }, record.passwordMinLength), '位密码']],
    ['passwordMinLetters', ['，不少于', h('span', { style: { margin: '0 2px', color: 'rgb(248,113,113)' } }, record.passwordMinLetters), '个字母']],
    ['passwordMinDigits', ['，不少于', h('span', { style: { margin: '0 2px', color: 'rgb(248,113,113)' } }, record.passwordMinDigits), '个数字']],
    ['specialCharacters', ['，仅允许特殊字符', h('span', { style: { margin: '0 2px', color: 'rgb(248,113,113)' } }, record.specialCharacters)]],
  ])

  const targetArr: any[] = []

  dataMap.forEach((val, key) => {
    if (record[key as keyof PasswordStrategy.BasicInfo]) {
      targetArr.push(...val)
    }
  })

  return h('div', targetArr)
}
