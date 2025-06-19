User model
- Mặc định địa chỉ giao hàng sẽ là rỗng nếu chưa thêm.
- Cần kiểm tra sản phẩm, shop yêu thích có đang trùng hay không nếu có thì không đc thêm.
- Giới hạn số lượng sản phẩm, shop yêu thích, địa chỉ để tránh spam (có thể là 100).
- Ví người dùng có thẻ dùng để mua sản phẩm từ ví hủy đang hàng đã thanh toán tiền cũng sẽ trả về ví.
- email là duy nhất và được xác định trước khi có thể đăng nhập tài khoản.

Shop model
- Kiểm tra nếu đang "bị cấm" đang trong "thời gian ban" hoặc đang "chờ duyệt" thì không hiển thị shop và sản phẩm của shop.
- Nếu vẫn còn trạng thái "pending" sẽ không được báo cáo tiếp shop hiện tại đối với mỗi người dùng.
- Follower sẽ tăng nếu shop được theo dỗi sẽ giảm khi bị hủy theo dỗi.
- Khi shop bị cấm hoặc bị ban sẽ có nội dung lỗi và ai là người cấm (để có thể khiếu nại).
- Nếu số lượng ban quá nhiều lần sẽ không thể truy cập được shop ( có thể là 5 lần hoặc theo quy định của sàn).

Review model
- Lưu lại nội dung comment chỉ những đơn hàng nhỏ (trong 1 đơn hàng lớn nếu đơn hàng có nhiều đơn nhỏ) đã được hoàn thành thì người dùng mới có thể comment, chấm điểm, thêm ảnh (nếu có) cho sản phẩm.
- Mỗi người dùng chỉ có thể bình luận và chấm điểm 1 lần cho 1 sản phẩm trong 1 order.

Product model
- Kiểm tra nếu đang "bị cấm" đang trong "thời gian ban" thì không hiển thị.
- Nếu vẫn còn trạng thái cảnh báo là "pending" sẽ không được báo cáo tiếp sản phẩm hiện tại đối với mỗi người dùng.
- Sản phẩm sẽ bị trừ số lượng trong kho mỗi khi đang hàng -> thành công.
- Follower sẽ tăng nếu sản phẩm được theo dỗi.
- Số lượt bán sẽ tăng nếu sản phẩm đã giao hàng thành công.
- Khi sản phẩm bị cấm hoặc bị ban vĩnh viễn sẽ có nội dung lỗi và ai là người cấm (để có thể khiếu nại).
- "numRating" sẽ tính trung bình từ các review ở model Review.

Order model
- Lưu lại các đơn hàng người dùng đã mua.
- Khi người dùng hủy đơn hàng cần cung cấp lý do.
- Trạng thái đơn hàng tổng sẽ chuyển thành complete nếu tất cả sản phẩm đã đến tay khách hàng.
- Khi người dùng nhận được hàng có thể nhận được hàng từng thời điểm khác nhau.
- Khi người dùng muốn trả hàng cần có lý do cụ thể, cung cấp hình ảnh.
- Khi trạng thái của sản phẩm là "shipped" bạn xác nhận đơn hàng và sau đó có thể đánh giá sản phẩm này, các comment của sản phẩm này sẽ được hiển thị ở chi tiết sản phẩm.
- Có thể thanh toán sản phẩm bằng COD, Card, Wallet.

Message model
- Lưu lại người đã chat và nội dung hội thoại.
- Có thể gửi ảnh, đánh dấu đã đọc và đã xóa.

Chat model
- Lưu lại các cuộc hội thoại.
- Chỉ hỗ trợ chat 1 - 1 (shop và customer hoặc admin và customer).
- Còn trò chuyển của shop và admin thì sẽ liên hệ thông qua email (Thiết lập sau).

Cart model
- Chỉ những sản phẩm nào được chọn mua mới mất trong giỏ hàng còn lại sẽ còn.

Banner model
- Banner sản phẩm sẽ hiện theo từng chương trình (sẽ có 1 chương trình mặc đinh).
- Trong 1 chương trình sẽ có hình ảnh của chương trình hiển thị trên banner.
- Khi chương trình kết thúc sẽ trở về chương trình mặc định của sản.
