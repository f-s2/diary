interface FormRule {
    type: 'string' | 'array',
    required: boolean,
    message: string,
    trigger?: ('blur' | 'change')[]
}