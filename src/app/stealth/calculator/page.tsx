"use client"
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Calculator() {
  const [input, setInput] = useState('');
  const router = useRouter();
  const handleClick = (value: string) => {
    if (value === 'AC') return setInput('');
    if (value === '=') {
      try {
        const result = eval(input).toString();
        setInput(result);
        if (input === '12+34') {
        sendSignal(input + '=' + result);
      }
      } catch {
        setInput('Error');
      }
    } else {
      const newInput = input + value;
      setInput(newInput);
      if (newInput === '1234') {
        sendSignal(newInput);
      }
    }
  };

  const sendSignal = async (signal: string) => {
    try {
    alert(`Signal sent: ${signal}`);
    if(signal === '1234') {
      router.push("/dashboard")
    }
    else{
        alert("sos signal")
    }
    //   await fetch('/api/signal', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ signal }),
    //   });
    } catch (err) {
      console.error('Failed to send signal', err);
    }
  };

  const buttons = ['1','2','3','+','4','5','6','-','7','8','9','*','AC','0','=','/'];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-sm p-4">
        <div className="bg-gray-200 text-right text-2xl p-4 rounded mb-4">{input || '0'}</div>
        <div className="grid grid-cols-4 gap-3">
          {buttons.map((btn, idx) => (
            <button
              key={idx}
              className="p-4 bg-purple-500 text-white rounded hover:bg-blue-600"
              onClick={() => handleClick(btn)}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
