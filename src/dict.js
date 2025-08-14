export const findOne = (value, arr) => {
    return arr.find((item) => item.value === value)
}

export const RepairStatus = [
    {label: '维修待确认', value: 1, color: '#FF9D00'},
    {label: '维修中', value: 2, color: '#004098'},
    {label: '维修超时', value: 5, color: '#FF2B00'},
]
