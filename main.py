from typing import Union
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os



from testclass import System, Category, Accessory, ReservationAccessory, Order, Cart, Payment, Account, Customer

from pydantic import BaseModel

class GetByEmailPassword(BaseModel):
    email: str | str = "sawabe@gmail.com"
    password: str = "sawabebe"

class SearchBrand(BaseModel):
    str_input: str
class SearchPrice(BaseModel):
    min_price: int
    max_price: int

class CustomerID(BaseModel):
    customer_id: str | str = "10000"
class OrderID(BaseModel):
    order_id: int

class ToCart(BaseModel):
    customer_id: str | str = "11015"
    accessory_id: str

class ConfirmOrder(BaseModel):
    customer_id: str | str = "11015"
    date_start: str | str = "7-3-2567"
    date_end: str | str = "9-3-2567"
class CancelOrder(BaseModel):
    customer_id: str
    order_id: int

class GetAccessory(BaseModel):
    accessory_id: str

class PaymentDetail(BaseModel):
    card_number: str
    expiration_date: str
    CVV: str
class PaymentModel(BaseModel):
    customer_id: str 
    payment_type: str
    payment_detail: Union[dict, PaymentDetail]
    order_id: int
    amount: int
    


app = FastAPI()

# Allow all origins and methods for CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# ------------------------------------------------
#ADD_ACCESSORY
Website = System()

category_camera = Category("Camera")
category_len = Category("Lens")
category_battery = Category("Battery")
category_tripod = Category("Tripod")

Website.add_category(category_camera)
Website.add_category(category_len)
Website.add_category(category_battery)
Website.add_category(category_tripod)

accessory1 = Accessory(id="001", name="EOS R10 (Body)", brand="Canon", cost=500, lenter="Tham", info="กล้อง CMOS APS-C ความละเอียด 24.2 ล้านพิกเซลถ่ายภาพต่อเนื่องได้สูงถึง 23 เฟรมต่อวินาที")
accessory2 = Accessory(id="002", name="EOS M50", brand="Canon", cost=400, lenter="Team", info="กล้อง Mirrorless 24.2 ล้าน Pixel พร้อมจอ Touch Screen VDO4k จอพับได้ Sefie ดี skintone สวย")
accessory3 = Accessory(id="003", name="X-T20", brand="Fujifilm", cost=350, lenter="Photo", info="กล้อง Mirrorless 24.2 ล้าน pixel Sensor ขนาด APS-C ถ่าย VDO 4K 30FPS พร้อมจอพับได้แบบ Touch Screen")
accessory4 = Accessory(id="004", name="RF 15-35mm f/2.8L IS USM", brand="Canon", cost=950, lenter="Tham", info="")
accessory5 = Accessory(id="005", name="Sigma 150-600mm f/5-6.3 DG OS HSM Contemporary", brand="Sony", cost=550, lenter="Team", info="")
accessory6 = Accessory(id="006", name="OEM NP-F980, F970", brand="Sony", cost=50, lenter="Team", info="")
accessory7 = Accessory(id="007", name="LP-E6NH", brand="Canon", cost=70, lenter="Photo", info="")
accessory8 = Accessory(id="008", name="MKBFRA4-BH", brand="Manfrotto", cost=100, lenter="Photo", info="")
accessory9 = Accessory(id="009", name="Q666", brand="Zomei", cost=80, lenter="Tham", info="")

category_camera.add_accessory(accessory1)
category_camera.add_accessory(accessory2)
category_camera.add_accessory(accessory3)
category_len.add_accessory(accessory4)
category_len.add_accessory(accessory5)
category_battery.add_accessory(accessory6)
category_battery.add_accessory(accessory7)
category_tripod.add_accessory(accessory8)
category_tripod.add_accessory(accessory9)


#ADD_CUSTOMER
admin = Customer(email="admin@hmail.com", password="admin888", name="Admin", tel=None, address=None, acc_id="00000", role="admin")
customer0 = Customer(email=None, password=None, name="Guest Guest", tel=None, address=None, acc_id="10000", role="guest")
customer1 = Customer(email="sawabe@gmail.com", password="sawabebe", name="Sawabe Sawasaki", tel="0828888888", address="Gaegenamg1", acc_id="10001", role="customer")
customer2 = Customer(email="kamatsu@gmail.com", password="kamikami", name="Kamitsuri Chisato", tel="0888888888", address="Suwannaphum", acc_id="10002", role="customer")
customer3 = Customer(email="12014@gmail.com", password="12014", name="Golf Gloffy", tel="0888888888", address="Nakhon Si Thammarat", acc_id="10003", role="customer")
Website.add_account(admin)
Website.add_account(customer0)
Website.add_account(customer1)
Website.add_account(customer2)
Website.add_account(customer3)


#ADD_CART
cart1 = Cart("001")
cart2 = Cart("002")
cart3 = Cart("003")
customer1.add_cart(cart1)
customer2.add_cart(cart2)
customer3.add_cart(cart3)

# For camera category
@app.get('/')
async def camera():
    images_folder = 'C:/Basic Web/OOP Project/Project/image/camera'
    images = []
    for filename in os.listdir(images_folder):
        if filename.endswith('.jpg') or filename.endswith('.png'):  # Adjust file extensions as needed
            image_path = os.path.join(images_folder, filename)
            images.append(image_path)
    return {"images": images}



# ------------------------------------------------

# ACCOUNT
# Create account



# ADMIN
# Check accessory
@app.get("/accessory/{accessory_id}", tags=["Admin Accessory"])
async def search_accessory(accessory_id: str) -> dict:
    accessory = Website.search_accessory_by_id(accessory_id)
    return {
        "id": accessory.get_accessory_id(),
        "name": accessory.get_accessory_name(),
        "brand": accessory.get_accessory_brand(),
        "price": accessory.get_accessory_cost(),
        "lenter": accessory.get_accessory_lenter(),
        "info": accessory.get_accessory_info(),
        "reservation": [reservation.get_order_id() for reservation in accessory.get_list_reservation()]
    }

# SEARCH
# Search customer by email and password
@app.post("/search_customer_by_email_password", tags=["Search"])
async def search_customer_by_email_password(data: GetByEmailPassword) -> dict:
    customer = Website.login(data.email, data.password)
    if customer != None:
        return {"data": customer.get_account_id()}
    else:
        return {"data": "Wrong email or password"}
    
# Search customer by id
@app.post("/search_account_name_by_id", tags=["Search"])
async def search_customer_name_by_id(data: CustomerID) -> str:
    account = Website.search_account_by_id(data.customer_id)
    if account != None:
        name = account.get_name()
        first_name = name.split()[0]
        return first_name
    else:
        return None
# Search order by id
@app.post("/search_order_by_id", tags=["Search"])
async def search_order_by_id(data: OrderID) -> dict:
    order = Website.search_order_by_id(data.order_id)
    reservation_accessory_data = order.get_list_reservation_accessory_in_order()
    reservation_accessory_list = []
    for reservation_accessory in reservation_accessory_data:
        accessory = reservation_accessory.get_reservation_accessory()
        reservation_accessory_list.append({
            "id": accessory.get_accessory_id(),
            "name": accessory.get_accessory_name(),
            "brand": accessory.get_accessory_brand(),
            "price": accessory.get_accessory_cost(),
            "lenter": accessory.get_accessory_lenter(),
            "info": accessory.get_accessory_info(),
            "date_start": reservation_accessory.get_date_start(),
            "date_end": reservation_accessory.get_date_end(),
            "order_id": reservation_accessory.get_order_id()
        })
    return {
        "order_id": order.get_order_id(),
        "status": order.get_order_status(),
        "data": reservation_accessory_list,
        "total": order.get_total_cost()
    }

    


# Search address and email by id
@app.post("/search_account_info_by_id", tags=["Search"])
async def search_account_info_by_id(data: CustomerID) -> dict:
    account = Website.search_account_by_id(data.customer_id)
    if account != None:
        return {
            "address": account.get_address(),
            "email": account.get_email()
        }
    else:
        return None

# Search by name
@app.post("/search_all_accessory_by", tags=["Search"])
async def search_all_accessory_by_brand(data: SearchBrand) -> dict:
    brand = data.str_input
    #searching
    data = Website.search_accessory_by_name(input_name=brand)
    if data != None:
        accessory_data = []
        for accessory in data:
            accessory_data.append({
                "id": accessory.get_accessory_id(),
                "name": accessory.get_accessory_name(),
                "brand": accessory.get_accessory_brand(),
                "price": accessory.get_accessory_cost(),
                "lenter": accessory.get_accessory_lenter()
            })
        return {"data": accessory_data}
    else:
        return {"data": f"Don't have brand name '{brand}'"}
# Search by price
@app.post("/search_accessory_by_price", tags=["Search"])
async def search_all_accessory_by_price(data: SearchPrice) -> dict:
    min_price = data.min_price
    max_price = data.max_price
    data = Website.search_accessory_by_price(min_price=min_price, max_price=max_price)
    if data != None:
        accessory_data = []
        for accessory in data:
            accessory_data.append({
                "id": accessory.get_accessory_id(),
                "name": accessory.get_accessory_name(),
                "brand": accessory.get_accessory_brand(),
                "price": accessory.get_accessory_cost(),
                "lenter": accessory.get_accessory_lenter()
            })
        return {"data": accessory_data}
    else:
        return {"data": f"Dont have accessory in range {min_price} - {max_price}"}

# SHOPPING CART
# Get accessory in cart
@app.post("/your_shopping_cart", tags=["Shopping Cart"])
async def your_shopping_cart(data: CustomerID) -> dict:
    customer_id = data.customer_id
    customer = Website.search_account_by_id(customer_id)
    if customer != None:
        shopping_cart = Website.search_cart_by_account_id(customer_id)
        accessory_data = []
        for accessory in shopping_cart.get_list_accessory_in_cart():
            accessory_data.append({
                "id": accessory.get_accessory_id(),
                "name": accessory.get_accessory_name(),
                "brand": accessory.get_accessory_brand(),
                "price": accessory.get_accessory_cost(),
                "lenter": accessory.get_accessory_lenter(),
                "info": accessory.get_accessory_info()
            })
        if len(shopping_cart.get_list_accessory_in_cart()) > 0:
            return {"data": accessory_data}
        else:
            return {"data": accessory_data}
    else:
        return {"data": f"Don't have customer id {customer_id}"}
# Add accessory to cart
@app.post("/add_to_cart", tags=["Shopping Cart"])
async def add_accessory_to_cart(data: ToCart) -> dict:
    customer_id = data.customer_id
    accessory_id = data.accessory_id
    # loop get cart from customer id
    customer = Website.search_account_by_id(customer_id)
    if customer != None:
        shopping_cart = Website.search_cart_by_account_id(customer_id)
        # add to cart
        accessory = Website.search_accessory_by_id(accessory_id)
        if accessory != None:
            shopping_cart.add_accessory_to_cart(accessory)
            return {"data": f"Accessory id {accessory_id} has been added to your cart"}
        else:
            return {"data": f"Don't have accessory id {accessory_id}"}
    else:
        return {"data": f"Don't have customer id {customer_id}"}
# Delete accessory in cart
@app.post("/del_accessory_in_cart", tags=["Shopping Cart"])
async def delete_accessory_in_cart(data: ToCart) -> dict:
    customer_id = data.customer_id
    accessory_id = data.accessory_id
    customer = Website.search_account_by_id(customer_id)
    if customer != None:
        shopping_cart = customer.get_cart()
        for accessory in shopping_cart.get_list_accessory_in_cart():
            if accessory.get_accessory_id() == accessory_id:
                shopping_cart.delete_accessory_in_cart(accessory)
                return {"data": f"Accessory id {accessory_id} has been deleted from your cart"}
        else:
            return {"data": f"You don't have accessory id {accessory_id} in your cart"}
    else:
        return {"data": f"Don't have customer id {customer_id}"}
# Clear accessory in cart
@app.post("/clear_accessory_in_cart", tags=["Shopping Cart"])
async def clear_accessory_in_cart(data: CustomerID) -> dict:
    customer_id = data.customer_id
    customer = Website.search_account_by_id(customer_id)
    if customer != None:
        shopping_cart = customer.get_cart()
        shopping_cart.clear_accessory_in_cart()
        return {"data": "Your cart has been cleared"}
    else:
        return {"data": f"Don't have customer id {customer_id}"}


# ORDER
# Check Order
@app.post("/check_status_confirmed_order", tags=["Order"])
async def check_status_confirmed_order(data: CustomerID) -> dict:
    customer_id = data.customer_id
    customer = Website.search_account_by_id(customer_id)
    if customer != None:
        order_list_data = []
        order_list = Website.search_order_by_account_id(customer_id)
        for order in order_list:
            accessory_data = []
            reservation_accessory_data = order.get_list_reservation_accessory_in_order()
            order_id = order.get_order_id()
            order_status = order.get_order_status()
            total_cost = order.get_total_cost()
                
            for reservation_accessory in reservation_accessory_data:
                accessory = reservation_accessory.get_reservation_accessory()
                accessory_data.append({
                    "id": accessory.get_accessory_id(),
                    "name": accessory.get_accessory_name(),
                    "brand": accessory.get_accessory_brand(),
                    "price": accessory.get_accessory_cost(),
                    "lenter": accessory.get_accessory_lenter(),
                    "info": accessory.get_accessory_info(),
                    "date_start": reservation_accessory.get_date_start(),
                    "date_end": reservation_accessory.get_date_end(),
                    "order_id": reservation_accessory.get_order_id()
                })
            order_list_data.append({
                "order_id": order_id,
                "status": order_status,
                "data": accessory_data,
                "total": total_cost
            })
        if len(order_list) > 0:
            return {"data": order_list_data}
        else:
            return {"data": order_list_data}
    else:
        return {"data": f"Don't have customer id {customer_id}"}
# Confirm Order
@app.post("/confirm_order", tags=["Order"])
async def confirm_order(data: ConfirmOrder) -> dict:
    customer_id = data.customer_id
    date_start = data.date_start
    date_end = data.date_end
    customer = Website.search_account_by_id(customer_id)
    if customer != None:
        shopping_cart = customer.get_cart()
        if len(shopping_cart.get_list_accessory_in_cart()) > 0:
            order = (Order(status="undischarged", customer_id=customer_id))
            Website.add_order(order)
            for accessory in shopping_cart.get_list_accessory_in_cart():
                reservation_accessory = ReservationAccessory(reservation_accessory=accessory, date_start=date_start, date_end=date_end, order_id=order.get_order_id())
                accessory.add_reservation_list(reservation_accessory)
                order.add_reservation_accessory_in_order(reservation_accessory)
            shopping_cart.clear_accessory_in_cart()
            return {"data": "Your order has been confirmed. Waiting for payment"}
        else:
            return {"data": "Your didn't add anything to your cart yet"}
    return {"data": f"Don't have customer id {customer_id}"}
# Cancel Order
@app.post("/cancel_order", tags=["Order"])
async def cancel_order(data: CancelOrder) -> dict:
    customer_id = data.customer_id
    order_id = data.order_id
    if Website.cancel_reservation(customer_id, order_id) != None:
        return {"data": "Success cancel"}
    else:
        return {"data": f"Don't have order id {order_id} in your account"}


# PAYMENT
# Check payment
@app.post("/check_payment", tags=["Payment"])
async def check_payment(data: CustomerID) -> dict:
    customer_id = data.customer_id
    payment_list = []
    customer = Website.search_account_by_id(customer_id)
    for payment in customer.get_payment_list():
        payment_list.append({
            "payment_id": payment.get_payment_id(),
            "payment_type": payment.get_payment_type(),
            "order_id": payment.get_order_id(),
            # "payment_detail": payment.get_payment_detail(),
            "customer_id": payment.get_customer(),
            "time": payment.get_time(),
        })
    return {"data": payment_list}
# Payment Method
@app.post("/payment", tags=["Payment"])
async def pay_order(data: PaymentModel) -> dict:
    customer_id = data.customer_id
    payment_type = data.payment_type
    payment_detail = data.payment_detail
    order_id = data.order_id
    amount = data.amount
    payment = Payment(
        customer_id=customer_id,
        payment_type=payment_type,
        payment_detail=payment_detail,
        amount=amount
    )
    check_payment = Website.payment(customer_id=customer_id, payment=payment, order_id=order_id)
    payment.add_time()
    return {"data": check_payment }









if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, log_level="info")