import ApprovalSender from '@/components/admin/ApprovalSender'

export default function AdminApprovalPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Sistema de Aprovação</h2>
        <p className="text-lg text-gray-300">Gestão interna de propostas de orçamento</p>
      </div>
      
      <ApprovalSender />
    </div>
  )
}