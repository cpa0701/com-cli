<template>
  <div class="amazing-filter-wrapper">
    <el-form
      ref="amazing-filter"
      :model="filter"
      size="mini"
      inline
      :rules="rules"
      :label-width="`${(maxLabelWidth.length + 2) * 16}px`"
    >
      <div class="base-filter-wrapper">
        <el-form-item
          v-for="(vnodeConfig, index) in filterConfig.filter(
            (item, index) => index < 2
          )"
          :key="index"
          :prop="
            Array.isArray(vnodeConfig.key)
              ? renameKey(vnodeConfig.key[0], vnodeConfig.key[1])
              : vnodeConfig.key
          "
          :label="`${vnodeConfig.label}：`"
        >
          <component
            :is="VNodeGenerator"
            :config="vnodeConfig"
            :vModel.sync="
              filter[
                Array.isArray(vnodeConfig.key)
                  ? renameKey(vnodeConfig.key[0], vnodeConfig.key[1])
                  : vnodeConfig.key
              ]
            "
          ></component>
        </el-form-item>
        <filter-button
          :isShowExtFilter="isShowExtFilter"
          :len="config.length"
          @query="handleQueryAction"
          @reset="handleResetForm"
          @clear="handleClearForm"
          @expand="handleCollapseStatus"
        />
      </div>
      <transition
        name="flashBounce"
        enter-class="flashBounce-enter"
        enter-to-class="flashBounce-enter-to"
        leave-class="flashBounce-leave"
        leave-to-class="flashBounce-leave-to"
      >
        <div
          class="ext-filter-wrapper"
          v-show="isShowExtFilter && config.length > 2"
        >
          <el-form-item
            v-for="(vnodeConfig, index) in filterConfig.filter(
              (item, index) => index >= 2
            )"
            :key="index"
            :prop="
              Array.isArray(vnodeConfig.key)
                ? renameKey(vnodeConfig.key[0], vnodeConfig.key[1])
                : vnodeConfig.key
            "
            :label="`${vnodeConfig.label}：`"
          >
            <!-- <component :is="VNodeGenerator" :config="vnodeConfig" :vModel="filter[vnodeConfig.key]" @updateVModel="updateVModel"></component> -->
            <component
              :is="VNodeGenerator"
              :config="vnodeConfig"
              ref="form-item-vm"
              :vModel.sync="
                filter[
                  Array.isArray(vnodeConfig.key)
                    ? renameKey(vnodeConfig.key[0], vnodeConfig.key[1])
                    : vnodeConfig.key
                ]
              "
            ></component>
          </el-form-item>
        </div>
      </transition>
    </el-form>
  </div>
</template>

<script>
  /* utils */
  import { _deepClone, foundDiffIndex } from "../util";
  import renderFactory from "../element-template/render-el-vnode.vue";

  /* components */
  import filterButton from "../element-template/filter-button.vue";

  export default {
    name: "amazing-filter",
    props: {
      config: {
        required: true,
        type: Array
      }
    },
    components: {
      filterButton
    },
    beforeCreate() {},
    data() {
      return {
        /* v-model 双向绑定数据 */
        filter: {},
        /* clone 出来的配置 */
        filterConfig: {},
        /* 用于数组类型的key值 */
        mappingList: {},
        /* 表单查询不需要用到的中间key值 */
        notNeedKey: [],
        /* label宽度 */
        maxLabelWidth: "",
        /* 扩展按钮区域是否显示 */
        isShowExtFilter: true,
        /* 表单校验规则 */
        rules: {},
        /* 实体 input select date ...etc 构造器 */
        VNodeGenerator: renderFactory
      };
    },
    methods: {
      /* updateVModel(key,value){
        alert("change")
        this.filter[key] = value
      }, */
      initAssignResponsiveData() {
        let that = this;
        this.filterConfig.forEach(item => {
          /* config有默认值 且key为数组 */
          if (item.default && Array.isArray(item.key)) {
            const DIFF_INDEX = foundDiffIndex(item.key[0], item.key[1]);
            const NOT_NEED_KEY = item.key[0].slice(0, DIFF_INDEX);

            this.notNeedKey.push(NOT_NEED_KEY);

            that.$set(that.filter, NOT_NEED_KEY, item.default);
            that.$set(that.filter, item.key[0], item.default[0]);
            that.$set(that.filter, item.key[1], item.default[1]);
            /* 解铃还需系铃人 */
            this.mappingList[NOT_NEED_KEY] = [item.key[0], item.key[1]];
          }
          /* config 没有默认值 且key为数组 */
          if (!item.default && Array.isArray(item.key)) {
            const DIFF_INDEX = foundDiffIndex(item.key[0], item.key[1]);
            const NOT_NEED_KEY = item.key[0].slice(0, DIFF_INDEX);

            this.notNeedKey.push(NOT_NEED_KEY);

            that.$set(that.filter, NOT_NEED_KEY, []);
            that.$set(that.filter, item.key[0], "");
            that.$set(that.filter, item.key[1], "");
            /* 解铃还需系铃人 */
            this.mappingList[NOT_NEED_KEY] = [item.key[0], item.key[1]];
          }
          /* config有默认值 且key不是数组 */
          if (item.default && !Array.isArray(item.key)) {
            that.$set(that.filter, item.key, item.default);
          }
          /* config有默认值 且为多选类型 */
          if (item.default && item.multiple) {
            that.$set(that.filter, item.key, item.default);
          }
          /* config没有默认值 且为多选类型 */
          if (!item.default && item.multiple) {
            that.$set(that.filter, item.key, []);
          }
          /* config item 啥也不是 */
          if (!item.default && !item.multiple && !Array.isArray(item.key)) {
            that.$set(that.filter, item.key, "");
          }
        });
      },
      ininCalcLabelWidth() {
        this.filterConfig.forEach(item => {
          this.maxLabelWidth =
            item.label.length > this.maxLabelWidth.length
              ? item.label
              : this.maxLabelWidth;
        });
      },
      initAssignRules() {
        this.filterConfig.forEach(item => {
          item.rules ? (this.rules[item.key] = item.rules) : undefined;
        });
      },

      handleQueryAction() {
        this.$refs["amazing-filter"].validate(valid => {
          if (valid) {
            this.isShowExtFilter = false;
            this.$emit("query", this.filter, this.notNeedKey);
          } else {
            this.isShowExtFilter = true;
            console.log("error submit!!");
            return false;
          }
        });
      },
      handleResetForm() {
        this.$refs["amazing-filter"].resetFields();
        const that = this

        /* 以下操作均为适配狗屎 element ui 的 日期、时间 range选择器重置时的脑残操作 */
        this.notNeedKey.forEach(item => {
          /* 取出所有的渲染完成的实例 */
          const refs = that.$refs["form-item-vm"]

          /* 遍历取出的实例数组，拿到当前 vm.config */
          refs.forEach(vm => {
            /* 当前key是数组，且没有有 default属性，那就用if中的方法重置 */
            if(Array.isArray(vm.config.key) && !vm.config.default){
              /* 并且 只要存在于 mappinglist ，则肯定是 range类型的数组 */
              that.mappingList[item] ? that.filter[item] = ["",""] : undefined
            }
          })

        })
      },
      handleClearForm() {
        this.$refs["amazing-filter"].clearValidate();
        /* eslint-disable */
        const ACTIONS = {
          "[object Number]":(target,key) =>  target[key] = undefined,
          "[object Undefined]":(target,key) =>  target[key] = undefined,
          "[object String]":(target,key) =>  target[key] = "" ,
          "[object Object]":(target,key) =>  target[key] = {} ,
          "[object Array]":(target,key) =>  this.mappingList[key] ? target[key] = ["",""] : target[key].length = 0,
        }
        for(const key in this.filter){

          ACTIONS[Object.prototype.toString.call(this.filter[key])](this.filter,key)
        }

      },
      handleCollapseStatus() {
        this.isShowExtFilter = !this.isShowExtFilter;
      },
      initWatchFilter(){
        Object.keys(this.filter).map( (key,index) => {
          this.$watch(`filter.${key}`,(newval,oldval) => {
            /* 如果是 range 类型的数组变化  */
            if(Object.hasOwnProperty.call(this.mappingList,key)){
              let linkKeyArr = this.mappingList[key]

              this.filter[linkKeyArr[0]] = this.filter[key][0]
              this.filter[linkKeyArr[1]] = this.filter[key][0]
            }
            /* 过滤调生成的key，不暴露给用户 */
            if(this.notNeedKey.includes(key)){
              return
            }
            /* 最后不管怎样都 emit */
            this.$emit("change",key,newval,oldval,this.filter)

          })
        })
      },
      renameKey(a,b){
        const DIFF_INDEX = foundDiffIndex(a,b)
        const NOT_NEED_KEY = a.slice(0,DIFF_INDEX)
        return NOT_NEED_KEY
      }
    },
    created() {
      this.filterConfig = _deepClone(this.config);
      this.initAssignResponsiveData();

      this.initAssignRules();
      this.ininCalcLabelWidth();
      /* 没有采用统一的监听 filter {deep:true} 是因为无法方便的拿到key */
      this.initWatchFilter();

    },
    mounted() {
      this.$refs["amazing-filter"].$el.addEventListener("keyup",(event) => {
        event.keyCode === 13 && this.handleQueryAction()
      })
    }
  };
</script>
<style lang="scss" scoped>
  *{
    box-sizing: border-box;
  }
  .amazing-filter-wrapper {
    width: 100%;
  }
  .amazing-filter-wrapper .el-form {
    border-bottom: 1px solid #eaeaea;
    padding: 24px 16px;
    *padding-bottom: 0;
    position: relative;
    width: 100%;
  }

  .amazing-filter-wrapper .el-form > div {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .amazing-filter-wrapper .el-form  ::v-deep label{
    text-align: right;
  }
  .amazing-filter-wrapper .el-form > div > .el-form-item {
    margin-bottom: 0;
    display: flex;
    flex-wrap: nowrap;
  }

  .amazing-filter-wrapper .ext-filter-wrapper {
    position: absolute;
    left: 0;
    z-index: 999;
    background: rgba(255,255,255,.9);
    //rgba(0,0,0,.5)
    box-shadow: 0px 10px 15px -20px rgba(0,0,0,.5)
  ;
    will-change: transform;
    border-top: 1px solid #eaeaea;
    border-bottom: 1px solid #eaeaea;
    padding: 16px 16px 0 16px;
    width: 100%;
    margin-top: 20px;
    transition: all .3s cubic-bezier(0.22, 0.5, 0.16, 1.66);
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    height: auto;

    ::v-deep .el-form-item {
      margin-bottom: 20px !important;
    }
  }


  /* 展开更多 动画 */
  .flashBounce-enter {
    opacity: 0;
  }
  .flashBounce-enter-to {
    opacity: 0.9;
  }
  .flashBounce-leave {
    opacity: 0.7;
    border: none !important;
    transform: translateY(-10px);
  }
  .flashBounce-leave-to {
    opacity: 0;
    border: none !important;
    transform: translateY(-20px);
  }
  /* 展开更多箭头 动画 */
  .arrow-direction {
    transform: rotate(90deg);
  }
  .arrow-direction-default {
    transition: all 0.2s linear;
  }
  /* 小化 时间选择器 */
  .short-picker {
    width: 174px !important;
  }

  ::v-deep .el-select__tags{

    .el-tag{
      display: flex;
      justify-content: center;
      align-items: center;
      padding-right: 10px;
    }
    .el-select__tags-text{
      display: inline-block;

      width: 32px !important;
      overflow: hidden;
      white-space: nowrap;
    }
  }
</style>
