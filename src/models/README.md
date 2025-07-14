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
- Nếu sản phẩm có giảm giá do vendor áp dụng sẽ lấy giá mà vendor đã áp dụng thay cho giá gốc

Order model
- Lưu lại các đơn hàng người dùng đã mua.
- Khi người dùng hủy đơn hàng cần cung cấp lý do.
- Trạng thái đơn hàng tổng sẽ chuyển thành complete nếu tất cả sản phẩm đã đến tay khách hàng.
- Khi người dùng nhận được hàng có thể nhận được hàng từng thời điểm khác nhau.
- Khi người dùng muốn trả hàng cần có lý do cụ thể, cung cấp hình ảnh.
- Khi trạng thái của sản phẩm là "shipped" bạn xác nhận đơn hàng và sau đó có thể đánh giá sản phẩm này, các comment của sản phẩm này sẽ được hiển thị ở chi tiết sản phẩm.
- Có thể thanh toán sản phẩm bằng COD, Card, Wallet.
- Tính lại số tiền của đơn hàng và người dùng sẽ trả nếu có áp dụng voucher tiền hao hụt sẽ do admin tính toán danh thu của vendor vẫn giữa nguyên.

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
- Banner sản phẩm sẽ hiện các chương trình theo móc thời gian các chương trình nào cùng móc thời gian sẽ cùng hiển thị (sẽ có 1 chương trình mặc đinh).
- Khi nhấn vào chương trình trên banner sẽ chuyển qua chương trình đó trong 1 trang khác (ví dụ 7.7, ... ).
- Khi chương trình kết thúc sẽ trở về chương trình mặc định của sản.
- Hiển thị các chương trình giảm giá hoặc các chương trình sắp diện ra, có thể liên kết các chương trình giảm giá với banner bấm vào sẽ hiện qua chỗ giảm giá theo chương trình.

Campaign model
- Giảm giá toàn sàn giảm giá theo phần trăm hoặc giảm giá theo số tiền cụ thể người dùng có thể nhận được giảm giá theo khoảng thời gian, số tiền giảm giá không ảnh hưởng tới danh thu của vendor admin sẽ chịu toàn chi phí cho chương trình (ví dụ như lễ các ngày như 7.7 ,...).

Voucher model
- Là các mã giảm giá do admin cung cấp ( vận chuyển, tổng đơn hàng đạt giá trị, giảm theo phần trăm, giảm theo giá trực tiếp)
- Các mã giảm giá sẽ có số lượng sử dụng (riêng mã giảm giá vận chuyển có thể sẽ là vĩnh viễn để kích thích mua hàng hoặc đạt móc cũng sẽ giảm giá vận chuyển để kích thích mua hàng).
- Các voucher sẽ có thời hạn sử dụng nếu hết sẽ không thể sử dụng.
- Khi mua hàng sẽ có mục chọn voucher, voucher này sẽ áp dụng toàn đơn không áp dụng riêng lẻ, khi sử dụng sẽ nhấn áp dụng đơn hàng sẽ áp dụng theo code được sinh ra để tiến hành giàm giá.

Notification model
- Dùng để thông báo cho (admin, user, seller).
- Thông báo cho user (đơn hàng (các thông báo nhỏ), chương trình sale toàn sàn vd: tuần lễ thời trang,... , đơn hàng đã tới, đơn hàng đc hoàn trả thành công hay chưa, đã nhận lại tiền hay chưa, thông báo đăng kí shop nếu có, thông báo các báo cáo đã được xử lý hay chưa, các tin nhắn mới).
- Thông báo cho seller (Có đơn hàng mới, Đơn hàng bị hủy, Sản phẩm bị từ chối, Tin nhắn mới từ khách, Thanh toán đã hoàn thành).
- Thông báo cho admin (Có shop mới đăng ký, Có sản phẩm mới cần duyệt, Có báo cáo vi phạm (shop, sản phẩm), Có tin nhắn support mới, Hệ thống lỗi (monitoring)).

Category model
- Mỗi loại sản phẩm sẽ thuộc 1 danh mục để quản lý chi phí (nền tảng, vat, các chi phí khác).
- Phí nền tảng và vat là bắt buộc áp dụng vào đơn hàng. Khi thanh toán sẽ tính các chi phí này.
- Giá hiển thị cho người dùng là giá đã bao gồm phí vat, phí nền tảng và các chi phí khác.
- Vendor muốn kiểm tra giá thì sẽ hiện thị giá final.
