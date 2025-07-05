# Xây dựng các agent hiệu quả

**Xuất bản ngày 19 tháng 12 năm 2024**

Chúng tôi đã làm việc với hàng chục nhóm xây dựng các agent LLM trong nhiều ngành công nghiệp. Một cách nhất quán, các triển khai thành công nhất sử dụng các mẫu đơn giản, có thể kết hợp thay vì các framework phức tạp.

Trong năm qua, chúng tôi đã làm việc với hàng chục nhóm xây dựng các agent mô hình ngôn ngữ lớn (LLM) trong nhiều ngành công nghiệp. Một cách nhất quán, các triển khai thành công nhất không sử dụng các framework phức tạp hay các thư viện chuyên dụng. Thay vào đó, họ xây dựng với các mẫu đơn giản, có thể kết hợp.

Trong bài viết này, chúng tôi chia sẻ những gì đã học được từ việc làm việc với khách hàng và tự xây dựng các agent, đồng thời đưa ra lời khuyên thực tế cho các nhà phát triển về việc xây dựng các agent hiệu quả.

## Các agent là gì?

"Agent" có thể được định nghĩa theo nhiều cách. Một số khách hàng định nghĩa agent là các hệ thống hoàn toàn tự trị hoạt động độc lập trong thời gian dài, sử dụng nhiều công cụ khác nhau để hoàn thành các nhiệm vụ phức tạp. Những người khác sử dụng thuật ngữ này để mô tả các triển khai có tính quy tắc hơn, tuân theo các quy trình công việc được xác định trước. Tại Anthropic, chúng tôi phân loại tất cả các biến thể này là **hệ thống có tính agent (agentic systems)**, nhưng có một sự phân biệt kiến trúc quan trọng giữa **quy trình công việc (workflows)** và **agent (agents)**:

*   **Quy trình công việc** là các hệ thống trong đó LLM và các công cụ được điều phối thông qua các đường dẫn mã được xác định trước.
*   **Agent**, mặt khác, là các hệ thống trong đó LLM tự động chỉ đạo các quy trình và việc sử dụng công cụ của riêng mình, duy trì quyền kiểm soát cách chúng hoàn thành nhiệm vụ.

Dưới đây, chúng tôi sẽ khám phá chi tiết cả hai loại hệ thống có tính agent. Trong Phụ lục 1 ("Agent trong thực tế"), chúng tôi mô tả hai lĩnh vực mà khách hàng đã nhận thấy giá trị đặc biệt trong việc sử dụng các loại hệ thống này.

## Khi nào (và khi nào không) nên sử dụng agent

Khi xây dựng các ứng dụng với LLM, chúng tôi khuyên bạn nên tìm giải pháp đơn giản nhất có thể và chỉ tăng độ phức tạp khi cần thiết. Điều này có thể có nghĩa là không xây dựng các hệ thống có tính agent chút nào. Các hệ thống có tính agent thường đánh đổi độ trễ và chi phí để có hiệu suất nhiệm vụ tốt hơn, và bạn nên xem xét khi nào sự đánh đổi này là hợp lý.

Khi cần độ phức tạp cao hơn, các quy trình công việc cung cấp khả năng dự đoán và tính nhất quán cho các nhiệm vụ được xác định rõ, trong khi các agent là lựa chọn tốt hơn khi cần sự linh hoạt và ra quyết định do mô hình điều khiển ở quy mô lớn. Tuy nhiên, đối với nhiều ứng dụng, việc tối ưu hóa các lệnh gọi LLM đơn lẻ với truy xuất và các ví dụ trong ngữ cảnh thường là đủ.

## Khi nào và làm thế nào để sử dụng các framework

Có nhiều framework giúp việc triển khai các hệ thống có tính agent trở nên dễ dàng hơn, bao gồm:

*   LangGraph từ LangChain;
*   Framework AI Agent của Amazon Bedrock;
*   Rivet, một trình xây dựng quy trình công việc LLM GUI kéo và thả; và
*   Vellum, một công cụ GUI khác để xây dựng và thử nghiệm các quy trình công việc phức tạp.

Các framework này giúp bạn dễ dàng bắt đầu bằng cách đơn giản hóa các tác vụ cấp thấp tiêu chuẩn như gọi LLM, định nghĩa và phân tích cú pháp các công cụ, và xâu chuỗi các lệnh gọi lại với nhau. Tuy nhiên, chúng thường tạo ra các lớp trừu tượng bổ sung có thể che khuất các prompt và phản hồi cơ bản, khiến chúng khó gỡ lỗi hơn. Chúng cũng có thể khiến bạn dễ dàng thêm sự phức tạp khi một thiết lập đơn giản hơn sẽ đủ.

Chúng tôi đề nghị các nhà phát triển nên bắt đầu bằng cách sử dụng trực tiếp các API của LLM: nhiều mẫu có thể được triển khai chỉ trong vài dòng mã. Nếu bạn sử dụng một framework, hãy đảm bảo bạn hiểu mã nguồn cơ bản. Những giả định không chính xác về những gì ẩn dưới "mui xe" là một nguồn lỗi phổ biến của khách hàng.

Xem cookbook của chúng tôi để biết một số triển khai mẫu.

## Các khối xây dựng, quy trình công việc và agent

Trong phần này, chúng ta sẽ khám phá các mẫu phổ biến cho các hệ thống có tính agent mà chúng tôi đã thấy trong sản xuất. Chúng ta sẽ bắt đầu với khối xây dựng nền tảng của mình—LLM được tăng cường—và tăng dần độ phức tạp, từ các quy trình công việc kết hợp đơn giản đến các agent tự trị.

### Khối xây dựng: LLM được tăng cường

Khối xây dựng cơ bản của các hệ thống có tính agent là một LLM được tăng cường với các bổ sung như truy xuất, công cụ và bộ nhớ. Các mô hình hiện tại của chúng tôi có thể chủ động sử dụng các khả năng này—tự tạo các truy vấn tìm kiếm, chọn các công cụ phù hợp và xác định thông tin nào cần giữ lại.

**LLM được tăng cường**

Chúng tôi khuyên bạn nên tập trung vào hai khía cạnh chính của việc triển khai: điều chỉnh các khả năng này cho phù hợp với trường hợp sử dụng cụ thể của bạn và đảm bảo chúng cung cấp một giao diện dễ dàng, được ghi chép đầy đủ cho LLM của bạn. Mặc dù có nhiều cách để triển khai các bổ sung này, một cách tiếp cận là thông qua Giao thức Ngữ cảnh Mô hình (Model Context Protocol) được phát hành gần đây của chúng tôi, cho phép các nhà phát triển tích hợp với một hệ sinh thái ngày càng phát triển của các công cụ của bên thứ ba với một triển khai client đơn giản.

Trong phần còn lại của bài viết này, chúng tôi sẽ giả định mỗi lệnh gọi LLM đều có quyền truy cập vào các khả năng tăng cường này.

### Quy trình công việc: Xâu chuỗi prompt (Prompt chaining)

Xâu chuỗi prompt phân tách một nhiệm vụ thành một chuỗi các bước, trong đó mỗi lệnh gọi LLM xử lý đầu ra của lệnh gọi trước đó. Bạn có thể thêm các kiểm tra theo chương trình (xem "cổng" trong sơ đồ bên dưới) vào bất kỳ bước trung gian nào để đảm bảo rằng quy trình vẫn đi đúng hướng.

**Quy trình công việc xâu chuỗi prompt**

**Khi nào nên sử dụng quy trình công việc này:** Quy trình công việc này lý tưởng cho các tình huống mà nhiệm vụ có thể được phân tách dễ dàng và rõ ràng thành các nhiệm vụ con cố định. Mục tiêu chính là đánh đổi độ trễ để có độ chính xác cao hơn, bằng cách làm cho mỗi lệnh gọi LLM trở thành một nhiệm vụ dễ dàng hơn.

**Ví dụ về nơi xâu chuỗi prompt hữu ích:**

*   Tạo bản sao marketing, sau đó dịch nó sang một ngôn ngữ khác.
*   Viết dàn ý của một tài liệu, kiểm tra xem dàn ý có đáp ứng các tiêu chí nhất định hay không, sau đó viết tài liệu dựa trên dàn ý đó.

### Quy trình công việc: Định tuyến (Routing)

Định tuyến phân loại một đầu vào và hướng nó đến một nhiệm vụ tiếp theo chuyên biệt. Quy trình công việc này cho phép tách biệt các mối quan tâm và xây dựng các prompt chuyên biệt hơn. Nếu không có quy trình công việc này, việc tối ưu hóa cho một loại đầu vào có thể làm giảm hiệu suất trên các đầu vào khác.

**Quy trình công việc định tuyến**

**Khi nào nên sử dụng quy trình công việc này:** Định tuyến hoạt động tốt cho các nhiệm vụ phức tạp có các danh mục riêng biệt được xử lý tốt hơn một cách riêng biệt và nơi việc phân loại có thể được xử lý chính xác, bởi một LLM hoặc một mô hình/thuật toán phân loại truyền thống hơn.

**Ví dụ về nơi định tuyến hữu ích:**

*   Chuyển các loại truy vấn dịch vụ khách hàng khác nhau (câu hỏi chung, yêu cầu hoàn tiền, hỗ trợ kỹ thuật) vào các quy trình, prompt và công cụ khác nhau ở hạ nguồn.
*   Định tuyến các câu hỏi dễ/phổ biến đến các mô hình nhỏ hơn như Claude 3.5 Haiku và các câu hỏi khó/bất thường đến các mô hình có khả năng hơn như Claude 3.5 Sonnet để tối ưu hóa chi phí và tốc độ.

### Quy trình công việc: Song song hóa (Parallelization)

Các LLM đôi khi có thể làm việc đồng thời trên một nhiệm vụ và có kết quả đầu ra của chúng được tổng hợp theo chương trình. Quy trình công việc này, song song hóa, thể hiện ở hai biến thể chính:

*   **Phân đoạn (Sectioning)**: Chia một nhiệm vụ thành các nhiệm vụ con độc lập chạy song song.
*   **Bỏ phiếu (Voting)**: Chạy cùng một nhiệm vụ nhiều lần để có được các kết quả đầu ra đa dạng.

**Quy trình công việc song song hóa**

**Khi nào nên sử dụng quy trình công việc này:** Song song hóa có hiệu quả khi các nhiệm vụ con được phân chia có thể được song song hóa để tăng tốc độ, hoặc khi cần nhiều quan điểm hoặc nỗ lực để có kết quả đáng tin cậy hơn. Đối với các nhiệm vụ phức tạp có nhiều yếu tố cần xem xét, các LLM thường hoạt động tốt hơn khi mỗi yếu tố được xử lý bởi một lệnh gọi LLM riêng biệt, cho phép tập trung chú ý vào từng khía cạnh cụ thể.

**Ví dụ về nơi song song hóa hữu ích:**

*   **Phân đoạn**:
    *   Triển khai các lan can bảo vệ (guardrails) trong đó một phiên bản mô hình xử lý các truy vấn của người dùng trong khi một phiên bản khác sàng lọc chúng để tìm nội dung hoặc yêu cầu không phù hợp. Điều này có xu hướng hoạt động tốt hơn là để cùng một lệnh gọi LLM xử lý cả lan can bảo vệ và phản hồi cốt lõi.
    *   Tự động hóa các đánh giá để đánh giá hiệu suất của LLM, trong đó mỗi lệnh gọi LLM đánh giá một khía cạnh khác nhau về hiệu suất của mô hình trên một prompt nhất định.
*   **Bỏ phiếu**:
    *   Xem xét một đoạn mã để tìm các lỗ hổng, trong đó một số prompt khác nhau xem xét và gắn cờ mã nếu chúng tìm thấy sự cố.
    *   Đánh giá xem một phần nội dung nhất định có không phù hợp hay không, với nhiều prompt đánh giá các khía cạnh khác nhau hoặc yêu cầu các ngưỡng bỏ phiếu khác nhau để cân bằng giữa dương tính giả và âm tính giả.

### Quy trình công việc: Điều phối viên-nhân viên (Orchestrator-workers)

Trong quy trình công việc điều phối viên-nhân viên, một LLM trung tâm sẽ tự động chia nhỏ các nhiệm vụ, giao chúng cho các LLM nhân viên và tổng hợp kết quả của chúng.

**Quy trình công việc điều phối viên-nhân viên**

**Khi nào nên sử dụng quy trình công việc này:** Quy trình công việc này rất phù hợp cho các nhiệm vụ phức tạp mà bạn không thể dự đoán trước các nhiệm vụ con cần thiết (ví dụ: trong lập trình, số lượng tệp cần thay đổi và bản chất của sự thay đổi trong mỗi tệp có thể phụ thuộc vào nhiệm vụ). Mặc dù có cấu trúc tương tự, điểm khác biệt chính so với song song hóa là tính linh hoạt của nó—các nhiệm vụ con không được xác định trước, mà được xác định bởi điều phối viên dựa trên đầu vào cụ thể.

**Ví dụ về nơi quy trình công việc điều phối viên-nhân viên hữu ích:**

*   Các sản phẩm lập trình thực hiện các thay đổi phức tạp cho nhiều tệp mỗi lần.
*   Các nhiệm vụ tìm kiếm liên quan đến việc thu thập và phân tích thông tin từ nhiều nguồn để tìm thông tin có thể liên quan.

### Quy trình công việc: Người đánh giá-người tối ưu hóa (Evaluator-optimizer)

Trong quy trình công việc người đánh giá-người tối ưu hóa, một lệnh gọi LLM tạo ra một phản hồi trong khi một lệnh gọi khác cung cấp đánh giá và phản hồi trong một vòng lặp.

**Quy trình công việc người đánh giá-người tối ưu hóa**

**Khi nào nên sử dụng quy trình công việc này:** Quy trình công việc này đặc biệt hiệu quả khi chúng ta có các tiêu chí đánh giá rõ ràng và khi việc tinh chỉnh lặp đi lặp lại mang lại giá trị có thể đo lường được. Hai dấu hiệu cho thấy sự phù hợp là, thứ nhất, các phản hồi của LLM có thể được cải thiện một cách rõ ràng khi con người trình bày phản hồi của họ; và thứ hai, LLM có thể cung cấp phản hồi như vậy. Điều này tương tự như quy trình viết lặp đi lặp lại mà một nhà văn con người có thể trải qua khi tạo ra một tài liệu được trau chuốt.

**Ví dụ về nơi quy trình người đánh giá-người tối ưu hóa hữu ích:**

*   Dịch thuật văn học nơi có những sắc thái mà LLM dịch giả có thể không nắm bắt được ban đầu, nhưng nơi một LLM người đánh giá có thể đưa ra những lời phê bình hữu ích.
*   Các nhiệm vụ tìm kiếm phức tạp đòi hỏi nhiều vòng tìm kiếm và phân tích để thu thập thông tin toàn diện, trong đó người đánh giá quyết định xem có cần tìm kiếm thêm hay không.

### Agent

Các agent đang xuất hiện trong sản xuất khi các LLM trưởng thành về các khả năng chính—hiểu các đầu vào phức tạp, tham gia vào lý luận và lập kế hoạch, sử dụng các công cụ một cách đáng tin cậy và phục hồi sau lỗi. Các agent bắt đầu công việc của mình bằng một lệnh từ, hoặc thảo luận tương tác với, người dùng con người. Khi nhiệm vụ đã rõ ràng, các agent sẽ tự lập kế hoạch và hoạt động độc lập, có thể quay lại với con người để biết thêm thông tin hoặc phán quyết. Trong quá trình thực thi, điều quan trọng là các agent phải có được "sự thật cơ bản" (ground truth) từ môi trường ở mỗi bước (chẳng hạn như kết quả gọi công cụ hoặc thực thi mã) để đánh giá tiến trình của nó. Các agent sau đó có thể tạm dừng để nhận phản hồi của con người tại các điểm kiểm tra hoặc khi gặp phải các trình chặn. Nhiệm vụ thường kết thúc sau khi hoàn thành, nhưng cũng phổ biến là bao gồm các điều kiện dừng (chẳng hạn như số lần lặp tối đa) để duy trì quyền kiểm soát.

Các agent có thể xử lý các nhiệm vụ phức tạp, nhưng việc triển khai chúng thường đơn giản. Chúng thường chỉ là các LLM sử dụng các công cụ dựa trên phản hồi từ môi trường trong một vòng lặp. Do đó, điều quan trọng là phải thiết kế các bộ công cụ và tài liệu của chúng một cách rõ ràng và chu đáo. Chúng tôi sẽ mở rộng về các phương pháp hay nhất để phát triển công cụ trong Phụ lục 2 ("Prompt Engineering cho các công cụ của bạn").

**Agent tự trị**

**Khi nào nên sử dụng agent:** Các agent có thể được sử dụng cho các vấn đề mở mà khó hoặc không thể dự đoán được số bước cần thiết và nơi bạn không thể mã hóa cứng một đường dẫn cố định. LLM có thể sẽ hoạt động trong nhiều lượt, và bạn phải có một mức độ tin tưởng nhất định vào việc ra quyết định của nó. Tính tự trị của các agent khiến chúng trở nên lý tưởng để mở rộng quy mô các nhiệm vụ trong môi trường đáng tin cậy.

Bản chất tự trị của các agent có nghĩa là chi phí cao hơn và khả năng xảy ra lỗi kép. Chúng tôi khuyên bạn nên thử nghiệm rộng rãi trong các môi trường sandbox, cùng với các lan can bảo vệ phù hợp.

**Ví dụ về nơi agent hữu ích:**

Các ví dụ sau đây là từ các triển khai của chính chúng tôi:

*   Một Agent lập trình để giải quyết các nhiệm vụ SWE-bench, liên quan đến việc chỉnh sửa nhiều tệp dựa trên mô tả nhiệm vụ;
*   Triển khai tham chiếu "sử dụng máy tính" của chúng tôi, trong đó Claude sử dụng máy tính để hoàn thành các nhiệm vụ.

**Luồng cấp cao của một agent lập trình**

## Kết hợp và tùy chỉnh các mẫu này

Những khối xây dựng này không mang tính quy tắc. Chúng là các mẫu phổ biến mà các nhà phát triển có thể định hình và kết hợp để phù hợp với các trường hợp sử dụng khác nhau. Chìa khóa thành công, cũng như với bất kỳ tính năng LLM nào, là đo lường hiệu suất và lặp lại trên các triển khai. Để nhắc lại: bạn chỉ nên xem xét việc thêm độ phức tạp *khi* nó cải thiện kết quả một cách rõ ràng.

## Tóm tắt

Thành công trong không gian LLM không phải là xây dựng hệ thống phức tạp nhất. Đó là về việc xây dựng hệ thống *phù hợp* với nhu cầu của bạn. Bắt đầu với các prompt đơn giản, tối ưu hóa chúng bằng đánh giá toàn diện và chỉ thêm các hệ thống có tính agent nhiều bước khi các giải pháp đơn giản hơn không đáp ứng được.

Khi triển khai các agent, chúng tôi cố gắng tuân theo ba nguyên tắc cốt lõi:

1.  Duy trì **sự đơn giản** trong thiết kế của agent.
2.  Ưu tiên **tính minh bạch** bằng cách hiển thị rõ ràng các bước lập kế hoạch của agent.
3.  Cẩn thận tạo ra giao diện máy tính-agent (ACI) của bạn thông qua **tài liệu và thử nghiệm** công cụ kỹ lưỡng.

Các framework có thể giúp bạn bắt đầu nhanh chóng, nhưng đừng ngần ngại giảm bớt các lớp trừu tượng và xây dựng với các thành phần cơ bản khi bạn chuyển sang sản xuất. Bằng cách tuân theo các nguyên tắc này, bạn có thể tạo ra các agent không chỉ mạnh mẽ mà còn đáng tin cậy, có thể bảo trì và được người dùng tin tưởng.

### Lời cảm ơn

Được viết bởi Erik Schluntz và Barry Zhang. Công trình này dựa trên kinh nghiệm của chúng tôi trong việc xây dựng các agent tại Anthropic và những hiểu biết quý báu được chia sẻ bởi khách hàng của chúng tôi, mà chúng tôi vô cùng biết ơn.

## Phụ lục 1: Agent trong thực tế

Công việc của chúng tôi với khách hàng đã tiết lộ hai ứng dụng đặc biệt hứa hẹn cho các agent AI chứng tỏ giá trị thực tế của các mẫu đã thảo luận ở trên. Cả hai ứng dụng đều minh họa cách các agent tăng thêm giá trị nhất cho các nhiệm vụ đòi hỏi cả cuộc trò chuyện và hành động, có tiêu chí thành công rõ ràng, cho phép các vòng lặp phản hồi và tích hợp sự giám sát có ý nghĩa của con người.

### A. Hỗ trợ khách hàng

Hỗ trợ khách hàng kết hợp các giao diện chatbot quen thuộc với các khả năng nâng cao thông qua tích hợp công cụ. Đây là một sự phù hợp tự nhiên cho các agent có tính mở hơn vì:

*   Các tương tác hỗ trợ tự nhiên theo một luồng hội thoại trong khi yêu cầu quyền truy cập vào thông tin và hành động bên ngoài;
*   Các công cụ có thể được tích hợp để lấy dữ liệu khách hàng, lịch sử đơn hàng và các bài viết trong cơ sở kiến thức;
*   Các hành động như hoàn tiền hoặc cập nhật phiếu yêu cầu có thể được xử lý theo chương trình; và
*   Thành công có thể được đo lường rõ ràng thông qua các giải pháp do người dùng xác định.

Một số công ty đã chứng minh tính khả thi của phương pháp này thông qua các mô hình định giá dựa trên việc sử dụng chỉ tính phí cho các giải pháp thành công, cho thấy sự tin tưởng vào hiệu quả của các agent của họ.

### B. Agent lập trình

Không gian phát triển phần mềm đã cho thấy tiềm năng đáng kể cho các tính năng LLM, với các khả năng phát triển từ hoàn thành mã đến giải quyết vấn đề tự trị. Các agent đặc biệt hiệu quả vì:

*   Các giải pháp mã có thể được xác minh thông qua các bài kiểm tra tự động;
*   Các agent có thể lặp lại trên các giải pháp sử dụng kết quả kiểm tra làm phản hồi;
*   Không gian vấn đề được xác định rõ và có cấu trúc; và
*   Chất lượng đầu ra có thể được đo lường một cách khách quan.

Trong triển khai của riêng chúng tôi, các agent hiện có thể giải quyết các vấn đề GitHub thực sự trong benchmark SWE-bench Verified chỉ dựa trên mô tả yêu cầu kéo. Tuy nhiên, trong khi kiểm thử tự động giúp xác minh chức năng, đánh giá của con người vẫn rất quan trọng để đảm bảo các giải pháp phù hợp với các yêu cầu hệ thống rộng hơn.

## Phụ lục 2: Prompt Engineering cho các công cụ của bạn

Bất kể bạn đang xây dựng hệ thống có tính agent nào, các công cụ có thể sẽ là một phần quan trọng của agent của bạn. Các công cụ cho phép Claude tương tác với các dịch vụ và API bên ngoài bằng cách chỉ định cấu trúc và định nghĩa chính xác của chúng trong API của chúng tôi. Khi Claude phản hồi, nó sẽ bao gồm một khối sử dụng công cụ trong phản hồi API nếu nó có kế hoạch gọi một công cụ. Các định nghĩa và thông số kỹ thuật của công cụ nên được chú ý đến kỹ thuật prompt engineering cũng như các prompt tổng thể của bạn. Trong phụ lục ngắn này, chúng tôi mô tả cách thực hiện prompt engineering cho các công cụ của bạn.

Thường có một số cách để chỉ định cùng một hành động. Ví dụ, bạn có thể chỉ định một chỉnh sửa tệp bằng cách viết một diff, hoặc bằng cách viết lại toàn bộ tệp. Đối với đầu ra có cấu trúc, bạn có thể trả về mã bên trong markdown hoặc bên trong JSON. Trong kỹ thuật phần mềm, những khác biệt như thế này là về hình thức và có thể được chuyển đổi qua lại mà không mất mát. Tuy nhiên, một số định dạng khó hơn nhiều để LLM viết hơn những định dạng khác. Viết một diff đòi hỏi phải biết có bao nhiêu dòng đang thay đổi trong tiêu đề khối trước khi mã mới được viết. Viết mã bên trong JSON (so với markdown) đòi hỏi phải thoát các ký tự xuống dòng và dấu ngoặc kép bổ sung.

Các đề xuất của chúng tôi để quyết định các định dạng công cụ là như sau:

*   Cung cấp cho mô hình đủ token để "suy nghĩ" trước khi nó tự dồn mình vào chân tường.
*   Giữ định dạng gần với những gì mô hình đã thấy xuất hiện tự nhiên trong văn bản trên internet.
*   Đảm bảo không có "chi phí" định dạng nào như phải giữ một số lượng chính xác hàng nghìn dòng mã, hoặc thoát chuỗi bất kỳ mã nào nó viết.

Một quy tắc chung là hãy nghĩ về bao nhiêu nỗ lực được đầu tư vào giao diện người-máy (HCI), và lên kế hoạch đầu tư một lượng nỗ lực tương tự vào việc tạo ra các giao diện *agent*-máy (ACI) tốt. Dưới đây là một số suy nghĩ về cách làm điều đó:

*   Đặt mình vào vị trí của mô hình. Có rõ ràng cách sử dụng công cụ này không, dựa trên mô tả và các tham số, hay bạn sẽ cần phải suy nghĩ cẩn thận về nó? Nếu vậy, thì điều đó cũng đúng với mô hình. Một định nghĩa công cụ tốt thường bao gồm ví dụ sử dụng, các trường hợp biên, yêu cầu định dạng đầu vào và ranh giới rõ ràng với các công cụ khác.
*   Làm thế nào bạn có thể thay đổi tên tham số hoặc mô tả để làm cho mọi thứ rõ ràng hơn? Hãy nghĩ về điều này như là viết một docstring tuyệt vời cho một nhà phát triển cấp dưới trong nhóm của bạn. Điều này đặc biệt quan trọng khi sử dụng nhiều công cụ tương tự.
*   Kiểm tra cách mô hình sử dụng các công cụ của bạn: Chạy nhiều ví dụ đầu vào trong workbench của chúng tôi để xem mô hình mắc những lỗi gì và lặp lại.
*   "Poka-yoke" các công cụ của bạn. Thay đổi các đối số để khó mắc lỗi hơn.

Trong khi xây dựng agent của chúng tôi cho SWE-bench, chúng tôi thực sự đã dành nhiều thời gian hơn để tối ưu hóa các công cụ của mình hơn là prompt tổng thể. Ví dụ, chúng tôi thấy rằng mô hình sẽ mắc lỗi với các công cụ sử dụng đường dẫn tệp tương đối sau khi agent đã di chuyển ra khỏi thư mục gốc. Để khắc phục điều này, chúng tôi đã thay đổi công cụ để luôn yêu cầu đường dẫn tệp tuyệt đối—và chúng tôi thấy rằng mô hình đã sử dụng phương pháp này một cách hoàn hảo. 