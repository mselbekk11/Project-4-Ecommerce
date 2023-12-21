import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { 
  useGetOrderDetailsQuery, 
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
  useDeliverOrderMutation,
} from '../slices/OrdersApiSlice';
import { ListGroupItem } from 'react-bootstrap';


const OrderScreen = () => {

  const { id: orderId } = useParams();

  const { 
    data: order, 
    refetch, 
    isLoading, 
    error 
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const { data: paypal, isLoading: loadingPayPal, error: errorPayPal } = useGetPaypalClientIdQuery();

  const { userInfo } = useSelector(state => state.auth);

  useEffect(() => {
    if(!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': paypal.clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      }
      if(order && !order.isPaid) {
        if (!window.paypal) {
          loadPayPalScript();
        }
      }
    }
  }, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success('Payment successful');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    });
  }

  // async function onApproveTest() {
  //   await payOrder({ orderId, details: {payer: {}} });
  //   refetch();
  //   toast.success('Payment successful');
  // }

  function onError(err) {
    toast.error(err.message);
  }

  function createOrder(data, actions) {
    return actions.order.create({
        purchase_units: [
          {
            amount: { 
              value: order.totalPrice,
            },
          },
        ],
      })
      .then((orderId) => {
        return orderId;
      });
  }

  const deliverOrderHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success('Order delivered');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  }

  return isLoading ? <Loader /> : error ? <Message variant="danger" /> : (
    <>
      <Row>
          <Col md={8}>
          <ListGroup variant='flush'>
          <ListGroupItem>

      <h3>Order: {order._id}</h3>
          </ListGroupItem>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>{' '}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Address:</strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant='success'>
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant='danger'>Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <>
                <Message variant='success'>Paid on {order.paidAt}</Message>
                </>
              ) : (
                <Message variant='danger'>Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>                          
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </Col>
                        <Col md={3}>
                        {order.isPaid && item.name === 'Influx Pack' ? (
                          <a href='https://collection.cloudinary.com/dtjasyr7k/2951d3343042d36695f25049b24f18e3' target='blank'><Button>Download Wallpaper</Button></a>
                          ) : order.isPaid && item.name === 'Space Collection Pack' ? (
                            <a href='https://collection.cloudinary.com/dtjasyr7k/cfb67fd067385b62b779d4995fb48f6c' target='blank'><Button>Download Wallpaper</Button></a>
                          ) : order.isPaid && item.name === 'Acrylic Paint Pack' ? (
                            <a href='https://collection.cloudinary.com/dtjasyr7k/eb9f813de4559b5bfc038b8a17c1aa17' target='blank'><Button>Download Wallpaper</Button></a>
                          ) : order.isPaid && item.name === 'Carbon Pack' ?(
                            <a href='https://collection.cloudinary.com/dtjasyr7k/7d73e8ef9236d8846c2aaf81eaaccdd9' target='blank'><Button>Download Wallpaper</Button></a>
                          ) : (
                            <></>
                          )}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
          </Col>
          <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}

                  {isPending ? <Loader /> : (
                    <div>
                      {/* THIS BUTTON IS FOR TESTING! REMOVE BEFORE PRODUCTION! */}
                      {/* <Button
                        style={{ marginBottom: '10px' }}
                        onClick={onApproveTest}
                      >
                        Test Pay Order
                      </Button> */}

                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    </div>
                  )}
                </ListGroup.Item>
              )}
            

            {loadingDeliver && <Loader />}
            
            { userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
              <ListGroup.Item>
                <Button
                  type='button'
                  className='btn btn-block'
                  onClick={() => deliverOrderHandler(order._id)}
                >
                  Mark As Delivered
                </Button>
              </ListGroup.Item>
            ) }
            </ListGroup>
          </Card>

          
              {/* {order.isPaid ? (
                <div className="download-card">
                <a href="https://res.cloudinary.com/dtjasyr7k/image/upload/v1703049502/Dark_Layers_-_Desktop_-_7_dqiags.jpg" target='blank'><Button className='btn-block' type='button'>Download Desktop Wallpaper</Button></a>
                <a href="https://res.cloudinary.com/dtjasyr7k/image/upload/v1703049499/Dark_Layers_-_Mobile_-_7_kljrvw.jpg" target='blank'><Button className='btn-block' type='button'>Download Mobile Wallpaper</Button></a>
                </div>
              ) : (
                <></>
              )} */}
          </Col>
      </Row>
    </>
  );
}

export default OrderScreen
