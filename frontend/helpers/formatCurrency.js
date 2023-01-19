

export default function(amount) {
    amount = "R$" + amount.toString().replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1.');

    if(amount.indexOf('.') === -1)
        return amount + '.00';

    var decimals = amount.split('.')[1];

    return decimals.length < 2 ? amount + '0' : amount;
};