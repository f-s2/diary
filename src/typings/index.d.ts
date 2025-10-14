interface FormRule {
    type?: 'string' | 'array' | 'number',
    required: boolean,
    message: string,
    trigger?: ('blur' | 'change')[]
}