import HeTableVirtual from './virtual-table'
import './index.scss'
import tableExtend from './table-extend'
import tableMixins from './table.mixins'

tableExtend(HeTableVirtual)
const xVirtualTableMixins = tableMixins(HeTableVirtual)

HeTableVirtual.name = 'HeTableVirtual'
if (!HeTableVirtual.mixins) {
  HeTableVirtual.mixins = []
}
HeTableVirtual.mixins.push(xVirtualTableMixins)

export default HeTableVirtual
