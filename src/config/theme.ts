import type { CSSProperties } from "vue"

interface StyleConfigType {
        default: CSSProperties
    }

export const UvTabsDefaultConfig:{
    itemStyle?: StyleConfigType
    activeStyle?: StyleConfigType
    inactiveStyle?: StyleConfigType
    lineWidth?: string
} = {
    itemStyle: {
         default: {
            color: 'rgba(102, 102, 102, 1)',
            fontSize: '13px',
            borderRadius: '3px',
            padding: '0 7.5px',
        }

    },
    activeStyle: {
         default: {
            color: 'var(--primary-color)',
            fontWeight: 500,
            border: '0.7px solid rgba(0, 64, 152, 1)'
        }
    },
    lineWidth: '0px'
}