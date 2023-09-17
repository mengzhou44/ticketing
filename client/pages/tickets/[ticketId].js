import useRequest from '../../hooks/use-request'
import Router from 'next/router'

const TicketShow = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: { ticketId: ticket.id },
    onSuccess: (data) => Router.push('/orders/[orderId]', `/orders/${data.id}`),
  })
  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
      {errors}
      <button onClick={()=> doRequest()} className='btn btn-primary'>
        Purchase
      </button>
    </div>
  )
}

TicketShow.getInitialProps = async (context, client, currentUser) => {
  const { ticketId } = context.query
  console.log({ ticketId })
  const { data } = await client.get(`/api/tickets/${ticketId}`)

  return { ticket: data }
}

export default TicketShow
