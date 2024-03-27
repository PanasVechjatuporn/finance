// params number = number you wanted to format with commas E.G. 100000 return 100,000
export const formatNumberWithCommas = (number) => {
    if(typeof number === 'string'){
        number = parseFloat(number)
    }
    const formatter = new Intl.NumberFormat('en-US');
    const formattedNumber = formatter.format(number);
    return formattedNumber;
}

// params number = number you wanted to round, digit = number of digit you wanted
export const roundNumber = (number, digit) => {
    return (Math.round((number + Number.EPSILON) * Math.pow(10,digit)) / Math.pow(10,digit))
}