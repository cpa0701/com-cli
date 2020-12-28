/**
 * 深度拷贝对象：以隔离原始table
 */
import { Table } from 'element-ui'
import { cloneDeep } from 'lodash'

export default cloneDeep(Table)
