import { useState } from 'react'

export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null)

  const doRequest = async (payload ={}) => {
    try {
      setErrors(null)
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...body, ... payload}),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Request failed')
      }

      onSuccess(data)
    } catch (err) {
      setErrors(
        <div className="alert alert-danger">
          <h4>Ooops....</h4>
          <ul className="my-0">
            {err.response.data.errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  }

  return { doRequest, errors }
}
