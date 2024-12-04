import { useRef, useState, useEffect } from 'react'
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'

import { register as registerService } from '../services/authService'

const NAME_REGEX = /^[a-zA-Z]{1,50}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/

const RegistrationForm = () => {

    const firstnameRef = useRef()
    const errorRef = useRef()

    const [firstname, setFirstname] = useState('')
    const [validFirstname, setValidFirstname] = useState(false)
    const [firstnameFocus, setFirstnameFocus] = useState(false)

    const [lastname, setLastname] = useState('')
    const [validLastname, setValidLastname] = useState(false)
    const [lastnameFocus, setLastnameFocus] = useState(false)

    const [email, setEmail] = useState('')
    const [validEmail, setValidEmail] = useState(false)
    const [emailFocus, setEmailFocus] = useState(false)

    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [passwordFocus, setPasswordFocus] = useState(false)

    const [matchPassword, setMatchPassword] = useState('')
    const [validMatchPassword, setValidMatchPassword] = useState(false)
    const [matchPasswordFocus, setMatchPasswordFocus] = useState(false)

    const [assignedTeam, setAssignedTeam] = useState('')

    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    // Focus on component mount should be on the first field
    useEffect(() => {
        firstnameRef.current.focus()
    }, [])

    // Validation for fields
    useEffect(() => {
        const result = NAME_REGEX.test(firstname)
        setValidFirstname(result)
    }, [firstname])

    useEffect(() => {
        const result = NAME_REGEX.test(lastname)
        setValidLastname(result)
    }, [lastname])

    useEffect(() => {
        const result = EMAIL_REGEX.test(email)
        setValidEmail(result)
    }, [email])

    useEffect(() => {
        const result = PASSWORD_REGEX.test(password)
        setValidPassword(result)

        const match = password === matchPassword
        setValidMatchPassword(match)
    }, [password, matchPassword])

    // Clears the error when user edits or corrects the form field
    useEffect(() => {
        setError('')
    }, [firstname, lastname, email, password, matchPassword])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const test1 = NAME_REGEX.test(firstname)
        const test2 = NAME_REGEX.test(lastname)
        const test3 = EMAIL_REGEX.test(email)
        const test4 = PASSWORD_REGEX.test(password)

        if (!test1 || !test2 || !test3 || !test4) {
            setError('Invalid Entry')
            return
        }

        const formData = { firstname, lastname, email, password, assignedTeam }
        try {
            await registerService(formData)
            setSuccess(true)
            setFirstname('')
            setLastname('')
            setEmail('')
            setPassword('')
            setMatchPassword('')
            setAssignedTeam('')
        } catch (err) {
            if (!err?.response) {
                setError('No Server Response')
            } else if (err.response?.status === 409) {
                setError('This email is already registered')
            } else {
                setError('Registration Failed')
            }
            errorRef.current.focus()
        }
    }

    return (
        <>
            {success ? (
                <section className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                    <div className="bg-white p-8 rounded shadow-md text-center">
                        <h1 className="text-2xl font-bold mb-4">Success!</h1>
                        <p className="text-lg">
                            <a className="text-indigo-500">
                                Verification link is sent to your email-id.
                            </a>
                        </p>
                    </div>
                </section>)
                : (
                    <div className="flex items-center justify-center min-h-[calc(100vh-160px)] bg-gray-100">
                        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
                            <h2 className="text-2xl font-bold text-center">Register</h2>
                            <p ref={errorRef} className={error ? 'text-red-600 bg-red-100 p-2 rounded mb-4' : 'sr-only'}>{error}</p>

                            <form className="space-y-4" onSubmit={handleSubmit} method="POST">

                                {/* First Name */}
                                <div>
                                    <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
                                        First Name
                                        <FontAwesomeIcon icon={faCheck} className={`ml-2 ${validFirstname ? "text-green-500" : "hidden"}`} />
                                        <FontAwesomeIcon icon={faTimes} className={`ml-2 ${validFirstname || !firstname ? "hidden" : "text-red-500"}`} />
                                    </label>
                                    <input type="text" id="firstname" name="firstname" className="w-full px-3 py-2 mt-1 border rounded-md"
                                        required
                                        ref={firstnameRef}
                                        value={firstname}
                                        onChange={(e) => setFirstname(e.target.value)}
                                    />
                                </div>

                                {/* Last Name */}
                                <div>
                                    <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
                                        Last Name
                                    </label>
                                    <input type="text" id="lastname" name="lastname" className="w-full px-3 py-2 mt-1 border rounded-md"
                                        required
                                        value={lastname}
                                        onChange={(e) => setLastname(e.target.value)}
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <input type="email" id="email" name="email" className="w-full px-3 py-2 mt-1 border rounded-md"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                {/* Password */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <input type="password" id="password" name="password" className="w-full px-3 py-2 mt-1 border rounded-md"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                                        Confirm Password
                                    </label>
                                    <input type="password" id="confirm-password" name="confirm-password" className="w-full px-3 py-2 mt-1 border rounded-md"
                                        required
                                        value={matchPassword}
                                        onChange={(e) => setMatchPassword(e.target.value)}
                                    />
                                </div>

                                {/* Assigned Team */}
                                <div>
                                    <label htmlFor="assignedTeam" className="block text-sm font-medium text-gray-700">
                                        Select Team
                                    </label>
                                    <select
                                        id="assignedTeam"
                                        name="assignedTeam"
                                        className="w-full px-3 py-2 mt-1 border rounded-md"
                                        required
                                        value={assignedTeam}
                                        onChange={(e) => setAssignedTeam(e.target.value)}
                                    >
                                        <option value="">Select a team</option>
                                        <option value="Mumbai Indians">Mumbai Indians</option>
                                        <option value="Chennai Super Kings">Chennai Super Kings</option>
                                        <option value="Royal Challengers Bangalore">Royal Challengers Bangalore</option>
                                        <option value="Kolkata Knight Riders">Kolkata Knight Riders</option>
                                        <option value="Delhi Capitals">Delhi Capitals</option>
                                        <option value="Sunrisers Hyderabad">Sunrisers Hyderabad</option>
                                        <option value="Punjab Kings">Punjab Kings</option>
                                        <option value="Rajasthan Royals">Rajasthan Royals</option>
                                        <option value="Gujarat Titans">Gujarat Titans</option>
                                        <option value="Lucknow Super Giants">Lucknow Super Giants</option>
                                    </select>
                                </div>

                                <button type="submit" className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600">
                                    Register
                                </button>
                            </form>

                            <p className="mt-4 text-center text-sm">
                                Already have an account? <Link to="/login" className="text-indigo-500">Log In</Link>
                            </p>
                        </div>
                    </div>
                )}
        </>
    )
}

export default RegistrationForm
