'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Send, Plus, Trash2, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

interface Service {
  id: string
  name: string
  selected: boolean
}

interface PowerUp {
  id: string
  name: string
  selected: boolean
}

interface SendResult {
  success: boolean
  message: string
  data?: {
    approvalToken: string
    customerName: string
    projectType: string
    estimatedValue: number
    sentAt: string
  }
  error?: string
}

const defaultServices: Service[] = [
  { id: 'design', name: 'Design UI/UX', selected: true },
  { id: 'frontend', name: 'Desenvolvimento Frontend', selected: true },
  { id: 'backend', name: 'Desenvolvimento Backend', selected: false },
  { id: 'mobile', name: 'Aplicativo Mobile', selected: false },
  { id: 'seo', name: 'Otimização SEO', selected: false },
  { id: 'hosting', name: 'Hospedagem e Domínio', selected: false },
  { id: 'maintenance', name: 'Manutenção e Suporte', selected: true }
]

const defaultPowerUps: PowerUp[] = [
  { id: 'analytics', name: 'Google Analytics 4', selected: false },
  { id: 'social', name: 'Integração Redes Sociais', selected: false },
  { id: 'payment', name: 'Gateway de Pagamento', selected: false },
  { id: 'chat', name: 'Chatbot IA', selected: false },
  { id: 'admin', name: 'Painel Administrativo', selected: false }
]

export default function ApprovalSender() {
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    projectType: '',
    budgetRange: '',
    message: '',
    estimatedValue: '',
    timeline: ''
  })

  const [services, setServices] = useState<Service[]>(defaultServices)
  const [powerUps, setPowerUps] = useState<PowerUp[]>(defaultPowerUps)
  const [customService, setCustomService] = useState('')
  const [customPowerUp, setCustomPowerUp] = useState('')
  const [adminToken, setAdminToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SendResult | null>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleService = (serviceId: string) => {
    setServices(prev => prev.map(service => 
      service.id === serviceId 
        ? { ...service, selected: !service.selected }
        : service
    ))
  }

  const togglePowerUp = (powerUpId: string) => {
    setPowerUps(prev => prev.map(powerUp => 
      powerUp.id === powerUpId 
        ? { ...powerUp, selected: !powerUp.selected }
        : powerUp
    ))
  }

  const addCustomService = () => {
    if (customService.trim()) {
      const newService: Service = {
        id: `custom-${Date.now()}`,
        name: customService.trim(),
        selected: true
      }
      setServices(prev => [...prev, newService])
      setCustomService('')
    }
  }

  const addCustomPowerUp = () => {
    if (customPowerUp.trim()) {
      const newPowerUp: PowerUp = {
        id: `custom-${Date.now()}`,
        name: customPowerUp.trim(),
        selected: true
      }
      setPowerUps(prev => [...prev, newPowerUp])
      setCustomPowerUp('')
    }
  }

  const removeCustomItem = (id: string, type: 'service' | 'powerup') => {
    if (type === 'service') {
      setServices(prev => prev.filter(service => service.id !== id))
    } else {
      setPowerUps(prev => prev.filter(powerUp => powerUp.id !== id))
    }
  }

  const sendApproval = async () => {
    if (!adminToken.trim()) {
      setResult({
        success: false,
        message: 'Token de administrador é obrigatório',
        error: 'Unauthorized'
      })
      return
    }

    const selectedServices = services
      .filter(service => service.selected)
      .map(service => service.name)

    const selectedPowerUps = powerUps
      .filter(powerUp => powerUp.selected)
      .map(powerUp => powerUp.name)

    if (selectedServices.length === 0) {
      setResult({
        success: false,
        message: 'Selecione pelo menos um serviço',
        error: 'Validation failed'
      })
      return
    }

    try {
      setLoading(true)
      setResult(null)

      const response = await fetch('/api/approval/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: formData.customerName,
          email: formData.email,
          projectType: formData.projectType,
          budgetRange: formData.budgetRange,
          message: formData.message,
          estimatedValue: parseFloat(formData.estimatedValue),
          timeline: formData.timeline,
          services: selectedServices,
          powerUps: selectedPowerUps.length > 0 ? selectedPowerUps : undefined,
          adminToken: adminToken
        }),
      })

      const data = await response.json()
      setResult(data)

      if (data.success) {
        // Limpar formulário em caso de sucesso
        setFormData({
          customerName: '',
          email: '',
          projectType: '',
          budgetRange: '',
          message: '',
          estimatedValue: '',
          timeline: ''
        })
        setServices(defaultServices)
        setPowerUps(defaultPowerUps)
      }

    } catch (error) {
      setResult({
        success: false,
        message: 'Erro ao enviar aprovação',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      })
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = () => {
    return formData.customerName && 
           formData.email && 
           formData.projectType && 
           formData.budgetRange && 
           formData.message && 
           formData.estimatedValue && 
           formData.timeline &&
           services.some(s => s.selected) &&
           adminToken
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Send className="w-6 h-6 mr-2" />
            Enviar Proposta de Aprovação
          </CardTitle>
          <CardDescription>
            Sistema interno para envio de propostas de orçamento com aprovação por email
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Informações do Cliente */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerName">Nome do Cliente *</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
                placeholder="Nome completo do cliente"
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email do Cliente *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="email@exemplo.com"
              />
            </div>
          </div>

          {/* Informações do Projeto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="projectType">Tipo de Projeto *</Label>
              <Select onValueChange={(value) => handleInputChange('projectType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Website Institucional">Website Institucional</SelectItem>
                  <SelectItem value="E-commerce">E-commerce</SelectItem>
                  <SelectItem value="Sistema Web">Sistema Web</SelectItem>
                  <SelectItem value="Landing Page">Landing Page</SelectItem>
                  <SelectItem value="Aplicativo Mobile">Aplicativo Mobile</SelectItem>
                  <SelectItem value="Redesign">Redesign</SelectItem>
                  <SelectItem value="Manutenção">Manutenção</SelectItem>
                  <SelectItem value="Consultoria">Consultoria</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="budgetRange">Faixa de Orçamento *</Label>
              <Select onValueChange={(value) => handleInputChange('budgetRange', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a faixa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="R$ 2.000 - R$ 5.000">R$ 2.000 - R$ 5.000</SelectItem>
                  <SelectItem value="R$ 5.000 - R$ 10.000">R$ 5.000 - R$ 10.000</SelectItem>
                  <SelectItem value="R$ 10.000 - R$ 20.000">R$ 10.000 - R$ 20.000</SelectItem>
                  <SelectItem value="R$ 20.000 - R$ 50.000">R$ 20.000 - R$ 50.000</SelectItem>
                  <SelectItem value="Acima de R$ 50.000">Acima de R$ 50.000</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Valor e Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="estimatedValue">Valor Estimado (R$) *</Label>
              <Input
                id="estimatedValue"
                type="number"
                value={formData.estimatedValue}
                onChange={(e) => handleInputChange('estimatedValue', e.target.value)}
                placeholder="15000"
                min="0"
                step="100"
              />
            </div>
            
            <div>
              <Label htmlFor="timeline">Prazo de Entrega *</Label>
              <Select onValueChange={(value) => handleInputChange('timeline', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o prazo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-2 semanas">1-2 semanas</SelectItem>
                  <SelectItem value="3-4 semanas">3-4 semanas</SelectItem>
                  <SelectItem value="1-2 meses">1-2 meses</SelectItem>
                  <SelectItem value="2-3 meses">2-3 meses</SelectItem>
                  <SelectItem value="3-6 meses">3-6 meses</SelectItem>
                  <SelectItem value="Acima de 6 meses">Acima de 6 meses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Descrição */}
          <div>
            <Label htmlFor="message">Descrição do Projeto *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Descreva detalhadamente o projeto, requisitos específicos, funcionalidades desejadas..."
              rows={4}
            />
          </div>

          {/* Serviços */}
          <div>
            <Label className="text-base font-semibold">Serviços Inclusos *</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {services.map((service) => (
                <div key={service.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={service.id}
                    checked={service.selected}
                    onCheckedChange={() => toggleService(service.id)}
                  />
                  <Label 
                    htmlFor={service.id} 
                    className="text-sm font-normal cursor-pointer flex-1"
                  >
                    {service.name}
                  </Label>
                  {service.id.startsWith('custom-') && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCustomItem(service.id, 'service')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex gap-2 mt-3">
              <Input
                value={customService}
                onChange={(e) => setCustomService(e.target.value)}
                placeholder="Adicionar serviço customizado"
                onKeyPress={(e) => e.key === 'Enter' && addCustomService()}
              />
              <Button type="button" onClick={addCustomService} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Power-ups */}
          <div>
            <Label className="text-base font-semibold">Power-ups (Opcionais)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {powerUps.map((powerUp) => (
                <div key={powerUp.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={powerUp.id}
                    checked={powerUp.selected}
                    onCheckedChange={() => togglePowerUp(powerUp.id)}
                  />
                  <Label 
                    htmlFor={powerUp.id} 
                    className="text-sm font-normal cursor-pointer flex-1"
                  >
                    {powerUp.name}
                  </Label>
                  {powerUp.id.startsWith('custom-') && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCustomItem(powerUp.id, 'powerup')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex gap-2 mt-3">
              <Input
                value={customPowerUp}
                onChange={(e) => setCustomPowerUp(e.target.value)}
                placeholder="Adicionar power-up customizado"
                onKeyPress={(e) => e.key === 'Enter' && addCustomPowerUp()}
              />
              <Button type="button" onClick={addCustomPowerUp} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Token Admin */}
          <div>
            <Label htmlFor="adminToken">Token de Administrador *</Label>
            <Input
              id="adminToken"
              type="password"
              value={adminToken}
              onChange={(e) => setAdminToken(e.target.value)}
              placeholder="Insira o token de administrador"
            />
          </div>

          {/* Resultado */}
          {result && (
            <Card className={`border-2 ${result.success ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  {result.success ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  )}
                  <div className="flex-1">
                    <p className={`font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                      {result.message}
                    </p>
                    {result.success && result.data && (
                      <div className="mt-2 text-sm text-green-700">
                        <p><strong>Token:</strong> {result.data.approvalToken.substr(0, 12)}...</p>
                        <p><strong>Cliente:</strong> {result.data.customerName}</p>
                        <p><strong>Valor:</strong> R$ {result.data.estimatedValue.toLocaleString('pt-BR')}</p>
                      </div>
                    )}
                    {!result.success && result.error && (
                      <p className="mt-1 text-sm text-red-600">
                        Erro: {result.error}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Botão de Envio */}
          <Button
            onClick={sendApproval}
            disabled={!isFormValid() || loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Enviando Proposta...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Enviar Proposta de Aprovação
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}