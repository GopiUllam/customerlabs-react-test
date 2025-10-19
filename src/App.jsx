import React, { useState } from 'react';
import Modal from './Modal';


// Schema options as required (label and value)
const OPTIONS = [
{ label: 'First Name', value: 'first_name' },
{ label: 'Last Name', value: 'last_name' },
{ label: 'Gender', value: 'gender' },
{ label: 'Age', value: 'age' },
{ label: 'Account Name', value: 'account_name' },
{ label: 'City', value: 'city' },
{ label: 'State', value: 'state' }
];


export default function App() {
const [isOpen, setIsOpen] = useState(false);


return (
<div className="app-root">
<h1>CustomerLabs - React Test</h1>
<button className="save-btn" onClick={() => setIsOpen(true)}>
Save segment
</button>


{isOpen && (
<Modal
onClose={() => setIsOpen(false)}
options={OPTIONS}
/>
)}
</div>
);
}
