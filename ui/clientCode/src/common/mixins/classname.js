import { useBEM } from '../../common/utils/classnames'
import { CSS_PREFIX } from '../../common/constant'

export const classesMixin = (name) => {
  const classnames = useBEM(name ? `${CSS_PREFIX}-${name}` : `${CSS_PREFIX}`)
  return {
    methods: {
      classes(...args) {
        return classnames(...args)
      }
    }
  }
}
