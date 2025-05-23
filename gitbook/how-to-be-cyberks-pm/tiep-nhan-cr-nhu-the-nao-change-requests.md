# Tiếp Nhận CR như thế nào  (Change Requests)

Trong quá trình làm dự án không tránh khỏi các Change Request (CR), các CR này nhằm mục đích sửa đổi để cho dự án phù hợp với nhu cầu mới phát sinh, vì thế CR là một điều tốt và cần thiết. Tuy nghiên khi tiếp nhận các CR này ta thường chưa có sự chuyển bị cần thiết, dẫn đến gặp một số vấn đề phát sinh trong quá trình này:

CR có conflict với các requirement. vì các CR là một hoạt động được thêm vào sau khi dự án đã hoạt động, điều này không tránh khỏi có xung đột với các tính năng đã có sẵn. vì tế ta cần Kiểm tra lại và thông báo cho khách hàng khi có conflict.

CR Gấp: Không ít trường hợp các CR nhằm mục đích Hot-fix một lỗi nào đó về business, hoặc đáp ứng một nhu cầu cấp thiết của người dùng. Vì vậy đầu tiên ta hãy phản ứng thật nhanh để xử lý được vấn đề cho khách hàng một cách gọn gàng. Tuy nhiên vì xử lý các CR gấp này gây ảnh hưởng không ít đến source code, thiết kế sản phẩm.

CR ảnh hưởng tới timeline dự án: Khách hàng sẽ thường xuyên không có khả năng xác định sự ảnh hưởng của dự án, Ví dụ khi một CR urgent được thêm vào, họ thường có giả định, CR này sẽ được hoàn thành một cách nhanh chóng và đơn giản. Vì thế ta có tránh nhiệm báo và thỏa thuận với khách hàng về các thay đổi này.

CR Gây thay đổi tới thiết kế giao diện: Ở một số trường hợp, khách hàng có thể yêu cầu development team thực hiện một CR, mà bỏ qua các quy trình, Điều này có thể gây ra sản phẩm sau khi được thực hiện CR sẽ khác với bản thiết kế giao diện (Trên Figma). Nếu điều này tích tụ lâu ngày có thể gây ảnh hưởng lớn tới dự án. Ví dụ Các thành viên mới tham gia sẽ hoang mang khi thấy bản thiết kế và sản phẩm khác nhau. Ta cũng không có một tham chiếu chuẩn (Bản thiết kế) để kiểm thử dự án.

CR Khó: Điều này thường xuyên xảy ra.

\


Một điều rất thường gặp là: khách hàng sẽ quên các CR này có tồn tại sau một thời gian chúng được hoàn thành. vì thế họ thường xuyên đánh giá hiệu quả làm việc của development team mà không có những CR này vào, dẫn tới ta thường nghe nhiều phàn nàn về performance.

Vì thế tôi đề xuất một check list cho Quản lý dự án có thể tránh được các lỗi thường gặp bên trên:

\


* Yêu cầu khách hàng gửi yêu cầu bằng văn bản. Ngay sau khi tiếp nhận CR&#x20;
* Đưa ra phản hồi về ảnh hưởng (side-effect) của CR về : Timeline, Source code, Thiết Kế, Effort, và Tính Khả Thi
* Cập nhật bản thiết kế chi tiết (Figma) trước khi bắt tay vào triển khai CR
* Lưu trữ vào CR List của dự án.&#x20;
* Tổ chức lại Sprint, hoặc timeline của dự án ngay khi CR đưa vào triển khai.&#x20;

\


Ở đây sẽ có một số anh chị em thắc mắc, tại sao lại cần đưa bằng văn bản. hoặc tối ưu nhất là sử dụng email. Vì khách hàng của ta thường rất hay "đãng trí". và có nhiều Giả định (Asumption). điều này làm cho họ thường mau chóng quên, hoặc giả định rằng ta đã biết, hoặc hiểu về những gì họ muốn truyền tải rồi. Không ít lần tôi gặp trường hợp khách hàng họ phát biểu sai nhu cầu của họ trong CR. Vì thế để đảm bảo ta và khách hàng cùng hiểu đúng 1 vấn đề, hãy chắc chắn rằng có một văn bản, hoặc email từ họ.
