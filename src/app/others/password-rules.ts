//password-rules.ts
const uppercaseRequired = true
const lowercaseRequired = true
const numberRequired = true
const symbolRequired = true
const allowedSymbols = '@#$€¿?¡!()^*%&|=+-,._:;'
const lengthEnabled = false
const minLength = 8     //use 0 for unlimited
const maxLength = 30    //use '' for unlimited

let rules = '^'
rules += uppercaseRequired ? '(?=.*?[A-Z])' : ''
rules += lowercaseRequired ? '(?=.*?[a-z])' : ''
rules += numberRequired ? '(?=.*?[0-9])' : ''
rules += symbolRequired ? `(?=.*?[${allowedSymbols}])` : ''
rules += '.'
rules += lengthEnabled ? `{${minLength},${maxLength}}` : '*'
rules += '$'

//rules = '/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[@#$€¿?¡!()^*%&|=+-,._:;]).{8,30}$/' //valor seguro de las reglas por defecto
//console.log('Password RegExp: ' + rules)

export const pwdRegExp = new RegExp(rules)