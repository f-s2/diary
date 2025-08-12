declare namespace PasswordStrategy {
  interface BasicInfo {
    'id': string
    'name': string
    'status': import('~@/enums/system').PasswordStatus
    'passwordMinLength': number
    'passwordMinLetters': number
    'passwordMinDigits': number
    'specialCharacters': string
    'expiryDays': number
    'reminderDays': number
    'note': string
  }
  type ListItem = BasicInfo & {
    'userCount': number
  }

  interface UserInfo {
    id: string
    username: string
    loginAccount: string
    organizeName: string
    jobNumber: string
  }

  interface BindUserInfo {
    id: string
    defaultPasswordPolicyUserList: UserInfo[]
    nowPasswordPolicyUserList: UserInfo[]
  }

}
