import { extend, get, set, bind, unbind } from 'omi/src/extend'
const BINDING_HANDLERS = []

const addBindingHandler = handler => {
    BINDING_HANDLERS.push(handler)
}
const isChangeOnUpdate = el => {
    if (el.hasAttribute('change-on-update')) {
        let val = el.getAttribute('change-on-update')
        return val === true || val === '1' || val === 'true'
    }
    return true
}
const updateSelect = (el, path, scope) => {
    let val = get(scope, path)
    if (val === false || val === null || val === undefined) {
        val = ''
    }
    el.value = val.toString()

}
/**
 * add select binding handler
 */
addBindingHandler((el, path, scope) => {
    if (el.nodeName === 'SELECT') {
        unbind(el, 'change')
        bind(el, 'change', () => {
            set(scope, path, el.value)
        })
        return updateSelect
    }
})

const updateRadio = (el, path, scope) => {
    el.checked = get(scope, path) === el.value
}

/**
 * add radio binding handler
 */
addBindingHandler((el, path, scope) => {
    if (el.type === 'radio' && el.nodeName == 'INPUT') {
        unbind(el, 'change')
        bind(el, 'change', () => {
            set(scope, path, el.value)
        })
        return updateRadio
    }
})

const updateCheckbox = (el, path, scope) => {
    const tureVal = el.getAttribute('o-true-value') || true
    let value = get(scope, path)
    if (value instanceof Array) {
        el.checked = value.includes(el.value)
    } else {
        el.checked = value === tureVal
    }
}
/**
 * add checkbox binding handler
 */
addBindingHandler((el, path, scope) => {
    if (el.type === 'checkbox' && el.nodeName == 'INPUT') {
        const tureVal = el.getAttribute('o-true-value') || true
        const falseVal = el.getAttribute('o-false-value') || false
        unbind(el, 'change')
        bind(el, 'change', () => {
            let value = get(scope, path)
            if (value instanceof Array) {
                let valSet = new Set(value)
                if (el.checked) {
                    valSet.add(el.value)
                } else {
                    valSet.delete(el.value)
                }
                value.splice(0, value.length, ...valSet)
            } else {
                set(scope, path, el.checked ? tureVal : falseVal)
            }
        })

        return updateCheckbox
    }
})
//input

const updateInput = (el, path, scope) => {
    el.value = get(scope, path) || ''
    // checkRequired(el)
}
/**
 * add input binding handler
 */
addBindingHandler((el, path, scope) => {
    if (el.nodeName == 'INPUT') {
        let filter = el.getAttribute('filter')
        if (filter) {
            let reg = new RegExp(filter)
            unbind(el, 'keypress')
            //过滤输入字符
            bind(el, 'keypress', evt => {
                if (!reg.test(evt.key)) {
                    evt.preventDefault()
                }
            })
        }

        unbind(el, 'input')
        bind(el, 'input', evt => {
            set(scope, path, el.value)
            // checkRequired(el)
        })

        return updateInput
    }
})

extend('model', (el, path, scope) => {
    let raw = scope
    scope = scope.bindingScope ?? scope.props?.bindingScope ?? scope
    if (scope === false) {
        raw = scope = window
    }

    let bindings = raw.__bindings ?? (raw.__bindings = [])

    //the o-model attr 顺序可以打乱
    Promise.resolve().then(() => {
        for (let handler of BINDING_HANDLERS) {
            let updateFunction = handler(el, path, scope)
            if (typeof updateFunction === "function") {
                bindings.push({
                    element: el,
                    path,
                    updateFunction
                })
                updateFunction(el, path, scope)
                break
            }
        }
    })

    if (!raw.hasOwnProperty('updateBindings')) {
        raw.updateBindings = () => {
            for (let binding of bindings) {
                binding.updateFunction(binding.element, binding.path, scope)
            }
        }
    }

})
