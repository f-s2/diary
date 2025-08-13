export enum StocktakingStatusEnum {
    NotStarted,
    InProgress,
    Completed
}

export const StocktakingStatusOptions = [
    {
        label: '待完成',
        value: StocktakingStatusEnum.NotStarted,
        color: '#FF9D00'
    },
    {
        label: '进行中',
        value: StocktakingStatusEnum.InProgress,
        color:"#3BB656"
    },
    {
        label: '已完成',
        value: StocktakingStatusEnum.Completed,
         color:"#3BB656"
    },
]