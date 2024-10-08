import queryString from "query-string";
import HttpContext from "../httpContext.js";
import Controller from "./Controller.js";
import { getQueryString } from "../utilities.js";

export default class MathsController extends Controller {
  constructor(HttpContext) {
    super(HttpContext);
  }

  get() {
    this.processOperation();
  }

  post() {
    this.processOperation();
  }

  put() {
    this.processOperation();
  }

  remove() {
    this.processOperation();
  }

  processOperation() {
    let params = this.HttpContext.path.params;
    let operator = params.op;
    let x = parseFloat(params.x);
    let y = parseFloat(params.y);
    let n = parseFloat(params.n);
    if (["+", " ", "-", "*", "/", "%"].includes(operator)) {
      if (Object.keys(params).length > 3) {
        params.error = "There are too many parameters";
      } else if (Object.keys(params).length < 3) {
        params.error = "There are not enough parameters";
      } else if (isNaN(x)) {
        params.error = "'x' is not a number or is missing";
      } else if (isNaN(y)) {
        params.error = "'y' is not a number or is missing";
      }
    } else if (["!", "p", "np"].includes(operator)) {
      if (Object.keys(params).length > 2) {
        params.error = "There are too many parameters";
      } else if (Object.keys(params).length < 2) {
        params.error = "There are not enough parameters";
      } else if (isNaN(n)) {
        params.error = "'n' is not a number or is missing";
      } else if (n <= 0 || !Number.isInteger(n)) {
        params.error = "'n' parameter must be an integer > 0";
      }
    } else {
      params.error = "operation doesn't exist";
    }

    if (params.error != null) {
      this.HttpContext.response.JSON(params);
      return;
    }

    switch (operator) {
      //addition with space
      case " ":
        params.value = x + y;
        break;
      //subtraction
      case "-":
        params.value = x - y;
        break;
      //multiplication
      case "*":
        params.value = x * y;
        break;
      //division
      case "/":
        if (x == 0) {
          params.value = "Nan";
        } else if (y == 0) {
          params.value = "Infinity";
        } else {
          params.value = x / y;
        }
        break;
      //modulo
      case "%":
        if (x == 0 || y == 0) {
          params.value = "NaN";
        } else {
          params.value = x % y;
        }

        break;
      //factorial
      case "!":
        params.value = this.getFactorial(n);
        break;
      //prime
      case "p":
        params.value = this.isPrime(n);
        break;
      //nieme prime
      case "np":
        params.value = this.findPrime(n);
        break;
      default:
        params.error = "invalid input";
        break;
    }

    this.HttpContext.response.JSON(params);
  }

  getFactorial(n) {
    if (n === 0 || n === 1) {
      return 1;
    }
    return n * this.getFactorial(n - 1);
  }

  isPrime(x) {
    for (let i = 2; i < x; i++) {
      if (x % i === 0) {
        return false;
      }
    }
    return x > 1;
  }

  findPrime(n) {
    let primeNumber = 0;
    for (let i = 0; i < n; i++) {
      primeNumber++;
      while (!this.isPrime(primeNumber)) {
        primeNumber++;
      }
    }
    return primeNumber;
  }
}
