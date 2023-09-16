const Orders = ({ orders }) => {
  console.log({ orders })
  return (
    <div>
      {orders.map((order) => (
        <div key={order.id}>
          <h3>{order.ticket.title}</h3>
          <p> {order.status}</p>
        </div>
      ))}
    </div>
  )
}

Orders.getInitialProps = async (conext, client) => {
  const { data } = await client.get('/api/orders')
  return { orders: data.orders }
}
export default Orders
