# simple-music-app
simple-music-app


![image](https://user-images.githubusercontent.com/39345855/167300109-f2fc57fc-d9be-4e1a-887e-5076d0fa2559.png)

Collaborative Music Space is a web-based music platform designed to provide users with a seamless, fast, and interactive experience for exploring, playing, and sharing music online. The platform is built using HTML, CSS (Bootstrap), and JavaScript for the front-end, offering an aesthetic and responsive design inspired by modern streaming services.

All media assets — including audio files and album covers — are hosted on Amazon S3 buckets, which serve as secure, scalable, and cost-efficient cloud storage. The project integrates Amazon CloudFront, a global content delivery network (CDN), to distribute music files and images from edge locations for minimal latency and high availability. This setup ensures that users can stream songs smoothly from anywhere, with optimized performance and bandwidth efficiency.

The application features a Google Sign-In integration for user authentication and provides functionalities such as playlist creation, song uploads, liked songs, and sharing options via WhatsApp, Telegram, or email. Users can switch between light and dark themes, manage their playlists, and explore categorized albums powered by CloudFront URLs.

By combining AWS S3 + CloudFront with a lightweight front-end framework, Collaborative Music Space demonstrates the potential of serverless, cloud-native web applications for media streaming. It eliminates the need for traditional hosting servers while ensuring robust scalability, security, and performance.

This project serves as a strong example of how static web apps can be effectively deployed using AWS services, making it an ideal learning and showcase platform for modern cloud integration in multimedia applications.
