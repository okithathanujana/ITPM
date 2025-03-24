import React, { useState } from 'react';

function BMICalculator() {
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [bmi, setBmi] = useState(null);
    const [message, setMessage] = useState('');

    const calculateBMI = (e) => {
        e.preventDefault();

        if (height === '' || weight === '') {
            setMessage('Please enter both height and weight.');
            return;
        }

        const heightInMeters = height / 100;
        const calculatedBMI = (weight / (heightInMeters * heightInMeters)).toFixed(2);

        setBmi(calculatedBMI);

        if (calculatedBMI < 18.5) {
            setMessage('You are underweight.');
        } else if (calculatedBMI >= 18.5 && calculatedBMI < 24.9) {
            setMessage('You have a normal weight.');
        } else if (calculatedBMI >= 25 && calculatedBMI < 29.9) {
            setMessage('You are overweight.');
        } else {
            setMessage('You are obese.');
        }
    };

    return (
        <div className="bmi-calculator p-4 bg-white rounded shadow-lg max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">BMI Calculator</h2>
            <form onSubmit={calculateBMI}>
                <div className="mb-4">
                    <label htmlFor="height" className="block text-sm font-medium">Height (cm)</label>
                    <input
                        type="number"
                        id="height"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 p-2 rounded"
                        placeholder="Enter height in cm"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="weight" className="block text-sm font-medium">Weight (kg)</label>
                    <input
                        type="number"
                        id="weight"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 p-2 rounded"
                        placeholder="Enter weight in kg"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-black"
                >
                    Calculate BMI
                </button>
            </form>
            {bmi && (
                <div className="mt-4">
                    <p>Your BMI: <strong>{bmi}</strong></p>
                    <p>{message}</p>
                </div>
            )}
        </div>
    );
}

export default BMICalculator;
