/*
    complex.js
        Client-side complex numbers in JavaScript
*/
var complex = {};

complex.i = [0, 1];
complex.logi = [0, 0.682188177];
complex.PI = [Math.PI, 0];
complex.E = [Math.E, 0];

complex.lnAccuracy = 20;


complex.re = function (a)
{
    return a[0];
}

complex.im = function (a)
{
    return a[1];
}

// Create a complex number from a real number
complex.reToC = function (a)
{
    return [a, 0];
}

complex.reC = function (a)
{
    return complex.reToC(complex.re(a));
}

complex.imC = function (a)
{
    return complex.reToC(complex.im(a));
}



complex.show = function (a)
{
    var im = complex.im(a);
    var re = complex.re(a);
    if (im == 1 && re == 0)
        return "i";
    if (im == 0)
        return re.toString();
    if (im == 1)
        return re + " + i";
    if (re == 0)
        return im + "i";
    return re + " + " + im + "i";
}

complex.add = function (a, b)
{
    return [complex.re(a) + complex.re(b), complex.im(a) + complex.im(b)];
}

complex.neg = function (a)
{
    return [-complex.re(a), -complex.im(a)];
}

complex.sub = function (a, b)
{
    return complex.add(a, complex.neg(b));
}

complex.mult = function (a, b)
{
    var a_Re, a_Im, b_Re, b_Im;
    a_Re = complex.re(a);
    a_Im = complex.im(a);
    b_Re = complex.re(b);
    b_Im = complex.im(b);
    return [a_Re * b_Re - a_Im * b_Im, a_Re * b_Im + a_Im * b_Re];
}

complex.recip = function (a)
{
    var re = complex.re(a);
    var im = complex.im(a);
    var divBy = re*re + im*im;
    return [re/divBy, -im/divBy]
}

complex.div = function (a, b)
{
    return complex.mult(a, complex.recip(b));
}

complex.exp = function (a)
{
    var re = complex.re(a);
    var im = complex.im(a);
    var expRe = Math.exp(re);
    return [expRe * Math.cos(im), expRe * Math.sin(im)];
}

complex.theta = function (a)
{
    return Math.atan(complex.im(a) / complex.re(a));
}

complex.abs = function (a)
{
    var re = complex.re(a);
    var im = complex.im(a);
    return Math.sqrt(re*re + im*im);
}

complex.polar = function (a)
{
    return [complex.abs(a), complex.theta(a)];
}

complex.arg = function (a)
{
    var x = complex.re(a);
    var y = complex.im(a);
    var theta = complex.theta(a);
    if (x > 0)
        return theta;
    if (x < 0 && y >= 0)
        return theta + Math.PI;
    if (x < 0 && y < 0)
        return theta - Math.PI;
    if (x == 0 && y > 0)
        return Math.PI / 2;
    if (x == 0 && y < 0)
        return -Math.PI / 2;
    return 1 / 0;
}

complex.ln = function (a)
{
    return [Math.log(complex.abs(a)), complex.arg(a)];
}

complex.log = function (base, a)
{
    return complex.div(complex.ln(a), complex.ln(base));
}

complex.pow = function (a, b)
{
    return complex.exp(complex.mult(b, complex.ln(a)));
}

complex.sin = function (a)
{
    var ia = complex.mult(complex.i, a);
    return complex.mult([0, 0.5], complex.sub(complex.exp(complex.neg(ia)), complex.exp(ia)));
}

complex.cos = function (a)
{
    return complex.sin(complex.sub(complex.reToC(Math.PI / 2), a));
}

complex.tan = function (a)
{
    return complex.div(complex.sin(a), complex.cos(a));
}

complex.sqrt = function (a)
{
    return complex.pow(a, complex.reToC(0.5));
}

complex.sinh = function (a)
{
    return complex.mult([0.5, 0], complex.sub(complex.exp(a), complex.exp(complex.neg(a))));
}

complex.cosh = function (a)
{
    return complex.mult([0.5, 0], complex.add(complex.exp(a), complex.exp(complex.neg(a))))
}

complex.tanh = function (a)
{
    return complex.div(complex.sinh(a), complex.cosh(a));
}

complex.rpn = function (s)
{
    // complex.rpn :: String -> (Complex -> Complex)


    var tokens = s.split(" ");

    return function(x)
    {
        var token;
        var stack = [];
        for (var i = 0; i < tokens.length; i++)
        {
            token = tokens[i];
            switch (token)
            {
            case "+":
                stack.push(complex.add(stack.pop(), stack.pop()));
                break;
            case "*":
                stack.push(complex.mult(stack.pop(), stack.pop()));
                break;
            case "-":
                var val2 = stack.pop();
                var val1 = stack.pop();
                stack.push(complex.sub(val1, val2));
                break;
            case "/":
                var val2 = stack.pop();
                var val1 = stack.pop();
                stack.push(complex.div(val1, val2));
                break;
            case "^":
                var val2 = stack.pop();
                var val1 = stack.pop();
                stack.push(complex.pow(val1, val2));
                break;
            case "sqrt":
                stack.push(complex.sqrt(stack.pop()));
                break;
            case "exp":
                stack.push(complex.exp(stack.pop()));
                break;
            case "sin":
                stack.push(complex.sin(stack.pop()));
                break;
            case "cos":
                stack.push(complex.cos(stack.pop()));
                break;
            case "tan":
                stack.push(complex.tan(stack.pop()));
                break;
            case "sinh":
                stack.push(complex.sinh(stack.pop()));
                break;
            case "cosh":
                stack.push(complex.cosh(stack.pop()));
                break;
            case "tanh":
                stack.push(complex.tanh(stack.pop()));
                break;
            case "re":
                stack.push(complex.reC(stack.pop()));
                break;
            case "im":
                stack.push(complex.imC(stack.pop()));
                break;
            case "x":
                stack.push(x);
                break;
            case "i":
                stack.push(complex.i);
                break;
            case "e":
                stack.push(complex.E);
                break;
            case "pi":
                stack.push(complex.PI);
                break;
            default:
                if (token[token.length-1] == "i")
                {
                    stack.push([0, parseFloat(token.substring(0, token.length-1))]);
                }
                else
                {
                    stack.push(complex.reToC(parseFloat(token)));
                }
            }
        }
        return stack.pop();
    };
}
