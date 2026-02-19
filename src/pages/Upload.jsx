import React, {useState} from 'react'
import Sidebar from '../components/Sidebar'
import FileDrop from '../components/FileDrop'
import Spinner from '../components/Spinner'
import { analyzeResume } from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function Upload(){
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleFile = (f) => setFile(f)

  const submit = async () => {
    if(!file) return setError('Please choose a file')
    setError('')
    setLoading(true)
    try{
      const res = await analyzeResume(file)
      // Map backend response shape to what Result.jsx expects
      const backendData = res.data
      const payload = {
        candidateName: file.name.replace(/\.[^/.]+$/, ''), // use filename as candidate name
        fraudScore: backendData?.analysis?.fraud_score ?? 0,
        riskLevel: backendData?.analysis?.risk_level ?? 'LOW',
        decision: backendData?.analysis?.decision ?? 'ACCEPT',
        highlights: backendData?.flags?.length
          ? backendData.flags
          : ['No suspicious points detected'],
        verification: backendData?.verification ?? {}
      }
      localStorage.setItem('rfd_last_result', JSON.stringify(payload))
      navigate('/result')
    }catch(e){
      setError('Failed to analyze. Is the backend running?')
    }finally{ setLoading(false) }
  }

  return (
    <div className="min-h-screen p-6 md:flex md:space-x-6">
      <Sidebar />
      <main className="flex-1">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Upload Resume</h1>
          <p className="text-gray-500">Upload PDF or DOCX for fraud analysis</p>
        </div>
        <div className="card max-w-2xl">
          <FileDrop onFile={handleFile} />
          {file && <div className="mt-4 text-sm">Selected: {file.name}</div>}
          {error && <div className="mt-3 text-red-600">{error}</div>}
          <div className="mt-4 flex items-center space-x-4">
            <button onClick={submit} className="bg-gradient-to-r from-primary to-accent text-white px-4 py-2 rounded-lg">Analyze</button>
            {loading && <Spinner/>}
          </div>
        </div>
      </main>
    </div>
  )
}
