/* eslint-disable */
export const phoneNumberValidator = (rule, value, callback) => {
    const reg = /^1([0-9]{10})$/g
    if(!reg.test(value)){
        callback(new Error('请输入正确的手机号'));
    } else {
        callback()
    }
    
}

