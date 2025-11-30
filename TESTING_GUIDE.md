# Order Management System - Testing Guide

## 🧪 Complete Testing Checklist

### Prerequisites
1. ✅ Set up email configuration (Resend or SMTP)
2. ✅ Set `ADMIN_EMAIL` in `.env.local`
3. ✅ Set `NEXT_PUBLIC_BASE_URL` in `.env.local`
4. ✅ Ensure Paystack test keys are configured

## Test Scenario 1: Complete Order Flow

### Step 1: Create Test Order
1. **Add products to cart**
   - Go to homepage
   - Add 2-3 products to cart
   - Verify cart shows correct items

2. **Go to checkout**
   - Navigate to `/checkout`
   - Fill in shipping address (or select saved address if logged in)
   - Enter email

3. **Complete payment with Paystack test card**
   - Card: `4084084084084081`
   - CVV: `408`
   - Expiry: Any future date (e.g., `12/25`)
   - PIN: `0000` (for test mode)

4. **Verify order creation**
   - ✅ Redirected to `/payment/callback`
   - ✅ Order appears in `/account/orders`
   - ✅ Order appears in `/admin/orders` with "New" badge
   - ✅ Order status is "paid"
   - ✅ Inventory decreased for purchased items

5. **Verify emails sent**
   - ✅ Customer receives "Order Confirmation" email
   - ✅ Admin receives "New Order Alert" email
   - Check spam folder if not received

### Step 2: Admin Status Updates

1. **Login as admin**
   - Go to `/login`
   - Use admin credentials
   - Navigate to `/admin/orders`

2. **View new order**
   - Click on order with "New" badge
   - Verify all order details visible
   - Verify status is "paid"

3. **Update to Processing**
   - Select "Processing" from dropdown
   - Click "Update Status"
   - ✅ Status updates
   - ✅ Status history shows change
   - ✅ No email sent (processing doesn't trigger email)

4. **Update to Shipped**
   - Select "Shipped" from dropdown
   - Enter tracking number: `TRACK123456`
   - Add note: "Order shipped via DHL"
   - Click "Update Status"
   - ✅ Status updates to "shipped"
   - ✅ Tracking number saved
   - ✅ Customer receives "Order Shipped" email
   - ✅ Email includes tracking number

5. **Update to Delivered**
   - Select "Delivered" from dropdown
   - Click "Update Status"
   - ✅ Status updates to "delivered"
   - ✅ Customer receives "Order Delivered" email
   - ✅ "New" badge removed (order marked as seen)

### Step 3: Customer View

1. **Login as customer**
   - Go to `/account/orders`
   - Click on the order

2. **Verify order details**
   - ✅ Order number displayed correctly (#SWU-2025-00001 format)
   - ✅ Status timeline shows all status changes
   - ✅ Tracking number visible (if shipped)
   - ✅ All products listed with images
   - ✅ Shipping address correct
   - ✅ Payment information displayed
   - ✅ Totals breakdown correct

3. **Test reorder**
   - Click "Reorder" button
   - ✅ Items added to cart
   - ✅ Redirected to cart page

4. **Test print invoice**
   - Click "Print Invoice"
   - ✅ Print dialog opens
   - ✅ Invoice formatted correctly

### Step 4: Cancel/Refund Flow

1. **Admin cancels order**
   - Go to `/admin/orders/[id]`
   - Select "Cancelled" status
   - Add note: "Customer requested cancellation"
   - Click "Update Status"
   - ✅ Status updates to "cancelled"
   - ✅ Inventory restored (check product stock)
   - ✅ Customer receives "Order Cancelled" email

2. **Verify inventory restored**
   - Go to `/admin/products`
   - Find the product that was cancelled
   - ✅ Stock increased by cancelled quantity

3. **Test refund status**
   - Select "Refunded" status
   - Click "Update Status"
   - ✅ Status updates to "refunded"
   - ✅ Customer receives cancellation email
   - ✅ Inventory remains restored

## Test Scenario 2: Edge Cases

### Test 1: Multiple Status Changes
1. Create order
2. Change status: Paid → Processing → Shipped → Delivered
3. ✅ Each change logged in statusHistory
4. ✅ Timeline shows all changes
5. ✅ Only shipped and delivered trigger emails

### Test 2: Uncancelling Order
1. Cancel an order
2. Change status back to "Processing"
3. ✅ Inventory deducted again
4. ✅ Order can proceed normally

### Test 3: Email Failures
1. Temporarily break email config
2. Update order status
3. ✅ Order status still updates
4. ✅ No error shown to admin
5. ✅ Error logged in console

### Test 4: Order Number Format
1. Create multiple orders
2. ✅ Order numbers increment: #SWU-2025-00001, #SWU-2025-00002, etc.
3. ✅ Format is consistent

## Test Scenario 3: Admin Features

### Test 1: New Order Badge
1. Create new order
2. ✅ "New" badge appears in admin orders list
3. ✅ Badge is red and animated
4. Click on order
5. ✅ Badge disappears after viewing

### Test 2: Order Filtering
1. Go to `/admin/orders`
2. Filter by "Paid" status
3. ✅ Only paid orders shown
4. Filter by "Shipped"
5. ✅ Only shipped orders shown

### Test 3: Order Search
1. Search by order number
2. ✅ Correct order found
3. Search by customer email
4. ✅ Orders for that customer found
5. Search by customer name
6. ✅ Orders for that customer found

## Test Scenario 4: Customer Features

### Test 1: Order List
1. Go to `/account/orders`
2. ✅ All user orders displayed
3. ✅ Status badges color-coded
4. ✅ Can filter by status
5. ✅ Pagination works (if >10 orders)

### Test 2: Order Details
1. Click on any order
2. ✅ Status timeline visible
3. ✅ All information correct
4. ✅ Can reorder items
5. ✅ Can print invoice

## 🐛 Common Issues & Fixes

### Issue: Emails not sending
**Fix:**
- Check `RESEND_API_KEY` or SMTP credentials in `.env.local`
- Verify `EMAIL_FROM` is set
- Check console for email errors
- In dev mode, emails are logged to console

### Issue: Order not appearing
**Fix:**
- Check Paystack webhook is configured
- Verify webhook URL: `https://yourdomain.com/api/paystack/webhook`
- Check webhook logs in Paystack dashboard
- Verify MongoDB connection

### Issue: Status not updating
**Fix:**
- Check admin is logged in
- Verify admin has correct role
- Check API route logs
- Verify order exists in database

### Issue: Inventory not updating
**Fix:**
- Check product IDs match
- Verify products exist in database
- Check console for errors
- Manually verify stock in database

## ✅ Success Criteria

All tests pass if:
- ✅ Orders created after payment
- ✅ Emails sent to customer and admin
- ✅ Status updates work correctly
- ✅ Inventory adjusts automatically
- ✅ Status timeline displays correctly
- ✅ "New" badge appears and disappears
- ✅ Tracking numbers saved and displayed
- ✅ Order numbers formatted correctly
- ✅ All status changes logged
- ✅ Customer can view and track orders
- ✅ Admin can manage all orders

## 🚀 Production Checklist

Before going live:
- [ ] Switch to Paystack live keys
- [ ] Configure production email (Resend recommended)
- [ ] Set `NEXT_PUBLIC_BASE_URL` to production URL
- [ ] Set `ADMIN_EMAIL` to real admin email
- [ ] Test with real payment (small amount)
- [ ] Verify webhook URL in Paystack dashboard
- [ ] Test all email templates
- [ ] Verify order number format
- [ ] Test inventory management
- [ ] Test status updates
- [ ] Verify all routes protected

---

**System is ready for production!** 🎉

