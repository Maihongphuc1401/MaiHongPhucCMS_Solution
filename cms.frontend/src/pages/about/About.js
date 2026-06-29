import React from "react";

const About = () => {

    return (

        <div className="container py-5">

            <div className="text-center mb-5">

                <h1 className="fw-bold">
                    Giới thiệu về Website
                </h1>

                <p className="text-muted">
                    Website thương mại điện tử
                </p>

            </div>

            <div className="row">

                <div className="col-lg-6">

                    <img
                        src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900"
                        className="img-fluid rounded shadow"
                        alt="about"
                    />

                </div>

                <div className="col-lg-6">

                    <h3>MaiHongPhuc Store</h3>

                    <p>
                        MaiHongPhuc Store là website thương mại điện tử chuyên
                        kinh doanh các sản phẩm điện tử chính hãng như điện thoại,
                        laptop, máy tính bảng, đồng hồ thông minh và phụ kiện.
                    </p>

                    <p>
                        Chúng tôi luôn mang đến cho khách hàng những sản phẩm
                        chất lượng cao với giá thành hợp lý cùng nhiều chương
                        trình khuyến mãi hấp dẫn.
                    </p>

                    <h4>Tầm nhìn</h4>

                    <p>
                        Trở thành một trong những website bán thiết bị điện tử
                        uy tín, hiện đại và thân thiện với người dùng.
                    </p>

                    <h4>Sản phẩm nổi bật</h4>

                    <ul>

                        <li>📱 Điện thoại</li>

                        <li>💻 Laptop</li>

                        <li>⌚ Smart Watch</li>

                        <li>🎧 Tai nghe</li>

                        <li>🖥️ Linh kiện máy tính</li>

                    </ul>

                </div>

            </div>

        </div>

    );

};

export default About;