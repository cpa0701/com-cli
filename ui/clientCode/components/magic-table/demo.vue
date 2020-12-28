
<template>
    <div>
        <zMagicTable
            :column="column"
            :data="data"
        />
    </div>
</template>

<script>
import {zMagicTable} from './index.js';
export default {
    name: "demo",
    components: {
        zMagicTable
    },
    data() {
        return {
            column: [],
            data: []
        }
    },
    mounted() {
        this.initData();
    },
    methods: {
        initData() {
            fetch('http://mock.xsyxapp.com/mock/91/getColumnData')
                .then( ( res ) => res.json() )
                .then( ( res ) => {
                    console.log('res', res);
                    this.column = res.data;
                }  )

            fetch( 'http://mock.xsyxapp.com/mock/91/gettabledata' )
                .then(  res => res.json() )
                .then( res => {
                    this.data = res.data
                } )
        }
    },
}
</script>
<style>
</style>