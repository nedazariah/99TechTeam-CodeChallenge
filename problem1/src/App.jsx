import {useState} from "react"

function sum_to_n_a(n) {
  let ans = 0;
  for (let i=1; i<=n; i++) {
    ans += i;
  }
  return ans;
}

function sum_to_n_b(n) {
  if (n<=1) {
    return n;
  } else {
    return n + sum_to_n_b(n-1);
  }
}

function sum_to_n_c(n) {
  if (n<=1) {
    return n;
  } else {
    return n * (n+1) / 2;
  }
}

function App() {
  const [num, setNum] = useState();
  const [func, setFunc] = useState("");
  const [exp, setExp] = useState("");

  const functions = [
    {id: "loop", label: "Loop", method: sum_to_n_a, explaination: "looping through the number and adding it to itself"},
    {id: "recursive", label: "Recursive", method: sum_to_n_b, explaination: "adding the number with a recursive function passing the number - 1 each time"},
    {id: "mf", label: "Mathematical Formula", method: sum_to_n_c, explaination: "using the mathematical formula: number * (number -1) / 2"},
  ]

  let result = 0;
  const n = parseInt(num);
  if (!isNaN(n) && func) {
    if (func === "loop") result = sum_to_n_a(n);
    if (func === "recursive") result = sum_to_n_b(n);
    if (func === "mf") result = sum_to_n_c(n);
  }

  return (
    <>
      <div className="main-container">
        <div className="main-card">
          
          <div className="text-center flex flex-col gap-2 w-95">
            <h1 className="text-3xl font-bold">
              Single Input Calculator
            </h1>
            <p className="text-gray-400 font">Simple. Powerful. Accurate</p>
          </div>

          <div className="flex flex-col gap-5 w-95">

            <div className="flex flex-col gap-2">
              <label for="number" className="block text-gray-400 font-bold text-sm">ENTER NUMBER</label>
              <input type="number" value={num} id="number" className="shadow border rounded border-blue-50 bg-blue-50 p-5 text-2xl text-gray-700 font-extrabold leading-tight focus:outline-none focus:shadow-outline [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" placeholder="0" 
                onChange={(e) => setNum(e.target.value)}/>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-gray-400 font-bold text-sm">SELECT FUNCTION</p>
              <div className="function-container flex">
                {functions.map((f) => (
                  <div
                    key={f.id}
                    className={`function-card p-5 border rounded-md border-blue-50 bg-blue-50 ${func === f.id ? 'clicked' : ''}`}
                    onClick={()=> { setFunc(f.id); setExp(f.explaination)}}>
                    <p>{f.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-95 border border-solid border-gray-200"></div>

          <div className="result-card text-center flex flex-col gap-2 p-4 w-95">
            <p className="text-blue-300 font-bold">CALCULATION RESULT</p>
            <h1 className="font-extrabold text-5xl">{result}</h1>
            <p className="text-gray-500 text-sm">Result is calculated by {exp}</p>
          </div>
        </div>
      </div>

    </>
  )
}

export default App;
