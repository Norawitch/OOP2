import datetime

class System:
    def __init__(self):
        self.__list_account = []
        self.__list_brand = []
        self.__list_category = []
        self.__list_order = []
        self.__list_promotion_code = []
        self.__list_contract = []
        self.__order_id_counter = 0
        self.__payment_id_counter = 0

    def get_list_account(self):
        return self.__list_account
    
    def get_list_brand(self):
        return self.__list_brand
    
    def get_list_category(self):
        return self.__list_category
    
    def get_list_order(self):
        return self.__list_order
    
    def get_list_promotion_code(self):
        return self.__list_promotion_code
    
    def add_account(self, customer):
        self.__list_account.append(customer)
        # self.__order_id_counter += 1
        # customer.edit_customer_id(self.__customer_id_counter)
    
    def add_category(self , category):
        self.__list_category.append(category)

    def add_order(self, order):
        self.__list_order.append(order)
        self.__order_id_counter += 1
        order.edit_order_id(self.__order_id_counter)  # Pass the incremented order_id

    def search_account_by_id(self, customer_id):
        for customer in self.__list_account:
            if customer_id == customer.get_account_id():
                return customer
        return None
    
    def search_order_by_account_id(self, customer_id):
        order_list = []
        for order in self.__list_order:
            if customer_id == order.get_account_id():
                order_list.append(order)       
        return order_list
    
    def search_order_by_id(self, order_id):
        for order in self.__list_order:
            if order_id == order.get_order_id():
                return order
        return None
    
    def search_cart_by_account_id(self, customer_id):
        for customer in self.__list_account:
            if customer_id == customer.get_account_id():
                return customer.get_cart()
        return None

    def search_accessory_by_name(self, input_name):
        search = ""
        for category in self.get_list_category():
            for accessory in category.get_list_accessory():
                if input_name.lower() in accessory.get_accessory_brand().lower():
                    search = accessory.get_accessory_brand()
        list_accessory_result = []
        for category in self.get_list_category():
            for accessory in category.get_list_accessory():
                if search == accessory.get_accessory_brand():
                    list_accessory_result.append(accessory)
        return list_accessory_result
    
    def search_accessory_by_price(self, min_price, max_price):
        def sort_price(list_accessory_result):
            for i in range(len(list_accessory_result)-1):
                for i in range(len(list_accessory_result)-1):
                    if list_accessory_result[i].get_accessory_cost() > list_accessory_result[i+1].get_accessory_cost():
                        temp = list_accessory_result[i]
                        list_accessory_result[i] = list_accessory_result[i+1]
                        list_accessory_result[i+1] = temp
            return list_accessory_result
        list_accessory_result = []
        for category in self.get_list_category():
            for accessory in category.get_list_accessory():
                if accessory.get_accessory_cost() >= min_price and accessory.get_accessory_cost() <= max_price:
                    list_accessory_result.append(accessory)
        if len(list_accessory_result) > 0:
            sort_accessory = sort_price(list_accessory_result)
            return sort_accessory
        else:
            return None
        
    def search_accessory_by_id(self, accessory_id):
        for category in self.get_list_category():
            for accessory in category.get_list_accessory():
                if accessory_id == accessory.get_accessory_id():
                    return accessory
        return None
    
    def login(self , input_email , input_password):
        for account in self.__list_account:
            if account.get_email() == input_email and account.get_password() == input_password:
                return account
        return None
    
    def cancel_reservation(self, customer_id , order_id):
        for order in self.__list_order :
            if customer_id == order.get_account_id() and int(order_id) == order.get_order_id():   
                order.edit_status("canceled")
                for reservation_accessory in order.get_list_reservation_accessory_in_order():
                    real_accessory = reservation_accessory.get_reservation_accessory()
                    for reservation in real_accessory.get_list_reservation():
                        if reservation.get_order_id() == int(order_id):
                            real_accessory.get_list_reservation().remove(reservation)
        return "success"
                
    def payment(self , customer_id ,payment, order_id):
        order_list = self.search_order_by_account_id(customer_id)
        customer = self.search_account_by_id(customer_id)
        for order in order_list:
            if order.get_order_id() == order_id:
                    order.edit_status("Paid")
                    customer.add_payment(payment)
                    payment.edit_order_id(order_id)
                    self.__payment_id_counter += 1
                    payment.edit_payment_id(self.__payment_id_counter)
                    return "Paid"
            else:
                return "Not found order id"

      
class Category:
    def __init__(self,category_type,category_amount = None):
        self.__category_type = category_type
        self.__category_amount = None
        self.__list_Accessory = [] 

    def get_category_type(self):
        return self.__category_type
    
    def get_category_amount(self):
        return self.__category_amount
    
    def add_accessory(self, accessory):
        self.__list_Accessory.append(accessory)

    def get_list_accessory(self):
        return self.__list_Accessory
    
    def remove_accessory_in_category(self,accessory):
        self.__list_Accessory.remove(accessory)

class Accessory:
    def __init__(self,id,name,brand,cost,lenter, info):
        self.__accessory_id = id
        self.__accessory_name = name
        self.__accessory_brand = brand
        self.__accessory_cost = cost
        self.__accessory_lenter = lenter
        self.__accessory_info = info
        self.__reservation_accessory_list =[]

    def get_accessory_id(self):
        return self.__accessory_id
    
    def get_accessory_name(self):
        return self.__accessory_name
    
    def get_accessory_brand(self):
        return self.__accessory_brand
    
    def get_accessory_cost(self):
        return self.__accessory_cost
    
    def get_accessory_lenter(self):
        return self.__accessory_lenter
    
    def get_accessory_info(self):
        return self.__accessory_info
    
    def get_list_reservation(self):
        return self.__reservation_accessory_list
    
    def add_reservation_list(self, reservation_accessory):
        self.__reservation_accessory_list.append(reservation_accessory)

class Payment:
    def __init__(self, payment_type, customer_id, payment_detail, amount):
        self.__payment_id = 1
        self.__payment_type = payment_type
        self.__payment_detail = payment_detail
        self.__payment_amount = amount
        self.__order_id = ""
        self.__customer = customer_id
        self.__time = ""

    def get_payment_type(self):
        return self.__payment_type
    
    def get_payment_id(self):
        return self.__payment_id
    
    def get_order_id(self):
        return self.__order_id
    
    def get_payment_detail(self):
        return self.__payment_detail
    
    def get_customer(self):
        return self.__customer
    
    def get_time(self):
        return self.__time
    
    def add_time(self):
        time = datetime.datetime.now()
        formatted_time = time.strftime("%Y-%m-%d %H:%M:%S")
        self.__time = formatted_time

    def edit_payment_id(self, new_payment_id):
        self.__payment_id = new_payment_id

    def edit_order_id(self, order_id):
        self.__order_id = order_id


class contract:
    def __init__(self , customer , lenter , order , status):
        self.__customer = customer
        self.__lenter = lenter
        self.__order = order 
        self.__status = status

    def get_atatus_contract(self):
        return self.__status
 
class Account:
    def __init__(self, name, email, password, tel, address , role , acc_id):
        self.__name = name
        self.__email = email
        self.__password = password
        self.__tel = tel
        self.__address = address
        self.__role = role
        self.__account_id = acc_id
        self.__list_contract = []

    def get_name(self):
        return self.__name
    
    def get_email(self):
        return self.__email
    
    def get_password(self):
        return self.__password
    
    def get_tel(self):
        return self.__tel

    def get_address(self):
        return self.__address
    
    def get_list_contract(self):
        return self.__list_contract
    
    def get_account_id(self):
        return self.__account_id
    
class Customer(Account):
    def __init__(self,  name, email, password, tel, address , role , acc_id,  cart = None):
        super().__init__(name, email, password, tel, address , role , acc_id)
        self.__cart = None
        self.__list_payment = []
    
    def get_list_order(self):
        return self.__list_order
    
    def get_cart(self):
        return self.__cart
    
    def get_payment_list(self):
        return self.__list_payment
    
    def edit_customer_id(self, customer_id):
        self.__customer_id = customer_id
    
    def add_cart(self, cart):
        self.__cart = cart
    
    def add_payment(self, payment):
        self.__list_payment.append(payment)

class Lenter(Account):
    def __init__(self,  name, email, password, tel, address , role , acc_id,  cart = None, income = None):
        super().__init__(name, email, password, tel, address , role , acc_id)
        self.__cart = None
        self.__income = None
        self.__list_payment = []
        self.__list_own_accessory = []
    
    def get_list_order(self):
        return self.__list_order
    
    def get_cart(self):
        return self.__cart
    
    def get_payment_list(self):
        return self.__list_payment
    
    def edit_customer_id(self, customer_id):
        self.__customer_id = customer_id
    
    def add_cart(self, cart):
        self.__cart = cart
    
    def add_payment(self, payment):
        self.__list_payment.append(payment)

    def add_accessory(self, id,name,brand,cost , category_type):
        accessory = Accessory(id,name,brand,cost,self.__lenter_id)
        category_type.add_accessory(accessory)
        self.__list_own_accessory.append(accessory)

    def remove_accessory(self, id):
        for category  in System.get_list_category:
            for accessory in category:
                if accessory.get_accessory_id() == id :
                    self.__list_own_accessory.append(accessory)
                    category.remove_accessory_in_category(accessory)

    def edit_income(self, amount):
        self.__income = amount

    
class Cart:
    def __init__(self, cart_id):
        self.__cart_id = cart_id
        self.__list_accessory_in_cart = []
        self.__amount = 0
        self.__status = 0
    
    def get_cart_status(self):
        return self.__status
        
    def set_cart_status(self, status):
        self.__status = status
    
    def get_cart_id(self):
        return self.__cart_id

    def get_amount(self):
        return self.__amount
    
    def set_amount(self, amount):
        self.__amount = amount

    def get_list_accessory_in_cart(self):
        return self.__list_accessory_in_cart

    def add_accessory_to_cart(self, accessory):
        self.__list_accessory_in_cart.append(accessory)
        self.__amount += 1

    def delete_accessory_in_cart(self, accessory):
        self.__list_accessory_in_cart.remove(accessory)
        self.__amount -= 1

    def clear_accessory_in_cart(self):
        self.__list_accessory_in_cart.clear()
        self.__amount = 0
    
    def check_reservation_accessory(self,reservation):
        for accessory in self.__list_accessory_in_cart:
            for i in accessory.get_list_reservation():
                print(i.get_date_start())
                if i.get_date_start() == reservation.get_date_start():
                    return "unavailable"
        return "Success"

class Order:
    __order_id = 1
    def __init__(self, status, customer_id):
        self.__status = status
        self.__customer_id = customer_id
        self.__list_reservation_accessory_in_order = []
        self.__total_cost = 0

    def get_order_id(self):
        return self.__order_id
    
    def get_order_status(self):
        return self.__status
    
    def get_account_id(self):
        return self.__customer_id
    
    def get_list_reservation_accessory_in_order(self):
        return self.__list_reservation_accessory_in_order
    
    def get_total_cost(self):
        self.__total_cost = self.calculate_total_cost()
        return self.__total_cost
    def calculate_total_cost(self):
        total = 0
        for reservation_accessory in self.__list_reservation_accessory_in_order:
            total += reservation_accessory.get_reservation_accessory().get_accessory_cost() * reservation_accessory.date_difference(reservation_accessory.get_date_start(), reservation_accessory.get_date_end())
        return total

    def add_reservation_accessory_in_order(self, reservation_accessory):
        self.__list_reservation_accessory_in_order.append(reservation_accessory)
    
    def edit_order_id(self, order_id):
        self.__order_id = order_id

    def edit_status(self, status):
        self.__status = status

class ReservationAccessory:
    def __init__(self, reservation_accessory, date_start, date_end, order_id):
        self.__reservation_accessory = reservation_accessory    # clone of accessory (Accessory Object)
        self.__date_start = date_start
        self.__date_end = date_end
        self.__order_id = order_id
    
    def get_date_start(self):
        return self.__date_start
    
    def get_date_end(self):
        return self.__date_end
    
    def get_reservation_accessory(self):
        return self.__reservation_accessory
    
    def get_order_id(self):
        return self.__order_id

    def date_difference(self, date_start, date_end):
        day_in_month = [0,31,28,31,30,31,30,31,31,30,31,30,31]

        def is_leap(year):
            return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)

        def day_of_year(day, month, year):
            day_of_years = 0
            if is_leap(year):
                day_in_month[2] += 1
            else:
                if month == 2 and day == 29:
                    return -1
            for i in range(1,month):
                day_of_years += day_in_month[i]
            day_of_years += day
            if is_leap(year):
                day_in_month[2] -= 1
            return day_of_years

        def day_in_year(year):
            days = 0
            if is_leap(year)==True:
                days = 366
            else:
                days = 365
            return days

        def day_split(date_start,date_end):
            y1, m1, d1 = date_start.split("-")
            y2, m2, d2 = date_end.split("-")
            y1, m1, d1 = int(y1), int(m1), int(d1)
            y2, m2, d2 = int(y2), int(m2), int(d2)
            return d1,m1,y1,d2,m2,y2

        def date_diff():
            day_count_temp = 0
            day_diff = 0
            d1,m1,y1,d2,m2,y2 = day_split(date_start, date_end)
            if check_input(d1,m1,y1)==False or check_input(d2,m2,y2)==False:
                return 0
            else:
                for y in range(y1,y2+1):
                    day_count_temp += day_in_year(y)
                    back = day_in_year(y2)-day_of_year(d2,m2,y2) - 1
                    front = day_of_year(d1,m1,y1)
                    day_diff = day_count_temp - front - back
                    return day_diff

        def check_input(d,m,y):
            if m in [1,3,5,7,8,10,12]:
                if d<0 or d>31:
                    return False
            elif m in [4,6,9,11]:
                if d<0 or d>30:
                    return False
            elif is_leap(y)==True and m==2:
                if d<0 or d>29:
                    return False
            else:
                return False

        return date_diff()