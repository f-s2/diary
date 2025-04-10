export const findOne = (value, arr) => {
    return arr.find((item) => item.value === value)
}

export const RepairStatus = [
    {label: '维修待确认', value: 1, color: '#f9ae3d'},
    {label: '维修中', value: 2, color: '#003A8B'},
    {label: '维修超时', value: 5, color: '#f56c6c'},
]
