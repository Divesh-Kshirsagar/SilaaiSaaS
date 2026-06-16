import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Scissors, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/authStore'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function RegisterPage() {
  const [form, setForm] = useState({ shopName: '', ownerName: '', phone: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      const res = await api.post('/auth/register', {
        shopName: form.shopName,
        ownerName: form.ownerName,
        phone: form.phone,
        password: form.password,
      })
      login(res.data)
      toast.success('Shop registered successfully!')
      navigate('/dashboard')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
            <Scissors size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold">SilaaiSaaS</h1>
          <p className="text-muted-foreground text-sm mt-1">Register your tailoring shop</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Create your account</CardTitle>
            <CardDescription>Set up your shop and start managing orders</CardDescription>
          </CardHeader>
          <form onSubmit={handleRegister}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shopName">Shop Name</Label>
                <Input id="shopName" name="shopName" placeholder="Ramesh Tailors" value={form.shopName} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ownerName">Your Name</Label>
                <Input id="ownerName" name="ownerName" placeholder="Ramesh Kumar" value={form.ownerName} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-phone">Phone Number</Label>
                <Input 
                  id="reg-phone" 
                  name="phone" 
                  type="tel" 
                  placeholder="9999999999" 
                  maxLength={10}
                  minLength={10}
                  pattern="[0-9]{10}"
                  title="Phone number must be exactly 10 digits"
                  value={form.phone} 
                  onChange={e => setForm({...form, phone: e.target.value.replace(/\D/g, '')})} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-password">Password</Label>
                <Input id="reg-password" name="password" type="password" placeholder="Min. 8 characters" value={form.password} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={handleChange} required />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 pt-2">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 size={16} className="animate-spin" />}
                Create Shop
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Already have an account?{' '}
                <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
