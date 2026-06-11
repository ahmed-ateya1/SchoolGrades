import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="gov-footer no-print">
      <div class="footer-accent"></div>
      <div class="footer-main">
        <div class="footer-container">
          <div class="footer-grid">
            <!-- School Info -->
            <div class="footer-section">
              <h3 class="footer-title">عن المدرسة</h3>
              <p class="footer-text">
                مدرسة الشهيد ملازم اول حمادة فهمي مباشر الثانوية المشتركة
              </p>
              <p class="footer-text footer-text-muted">
                تلتزم المدرسة بتقديم أفضل مستوى تعليمي لأبنائنا الطلاب وتأهيلهم لمستقبل مشرق
              </p>
            </div>

            <!-- Quick Links -->
            <div class="footer-section">
              <h3 class="footer-title">روابط سريعة</h3>
              <ul class="footer-links">
                <li><a href="/">الرئيسية</a></li>
              </ul>
            </div>

            <!-- Contact -->
            <div class="footer-section">
              <h3 class="footer-title">تواصل معنا</h3>
              <ul class="footer-contact">
                <li>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                  <span>جمهورية مصر العربية</span>
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                  <span>info&#64;school.edu.eg</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="footer-bottom">
        <div class="footer-container">
          <div class="footer-bottom-content">
            <p>© {{ currentYear }} مدرسة الشهيد ملازم اول حمادة فهمي مباشر الثانوية المشتركة - جميع الحقوق محفوظة</p>
            <p class="footer-ministry">جمهورية مصر العربية - وزارة التربية والتعليم</p>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .gov-footer {
      margin-top: auto;
    }

    .footer-accent {
      height: 4px;
      background: linear-gradient(90deg, var(--gov-gold) 0%, var(--gov-navy) 50%, var(--gov-gold) 100%);
    }

    .footer-main {
      background: linear-gradient(135deg, var(--gov-navy) 0%, var(--gov-navy-dark) 100%);
      padding: 48px 0 32px;
    }

    .footer-container {
      max-width: var(--container-max);
      margin: 0 auto;
      padding: 0 var(--container-padding);
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 48px;
    }

    .footer-section {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .footer-title {
      color: var(--gov-gold);
      font-size: 1.1rem;
      font-weight: 700;
      margin-bottom: 4px;
      position: relative;
      padding-bottom: 12px;
    }

    .footer-title::after {
      content: '';
      position: absolute;
      bottom: 0;
      right: 0;
      width: 40px;
      height: 2px;
      background: var(--gov-gold);
      border-radius: 1px;
    }

    .footer-text {
      color: rgba(255, 255, 255, 0.85);
      font-size: 0.9rem;
      line-height: 1.8;
    }

    .footer-text-muted {
      color: rgba(255, 255, 255, 0.55);
      font-size: 0.85rem;
    }

    .footer-links {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .footer-links a {
      color: rgba(255, 255, 255, 0.75);
      font-size: 0.9rem;
      transition: all var(--transition);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .footer-links a::before {
      content: '◂';
      font-size: 0.7rem;
      color: var(--gov-gold);
    }

    .footer-links a:hover {
      color: var(--gov-gold);
      transform: translateX(-4px);
    }

    .footer-contact {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .footer-contact li {
      display: flex;
      align-items: center;
      gap: 10px;
      color: rgba(255, 255, 255, 0.75);
      font-size: 0.9rem;
    }

    .footer-contact svg {
      color: var(--gov-gold);
      flex-shrink: 0;
      width: 16px;
      height: 16px;
    }

    .footer-bottom {
      background: var(--gov-navy-dark);
      padding: 16px 0;
      border-top: 1px solid rgba(212, 175, 55, 0.15);
    }

    .footer-bottom-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .footer-bottom-content p {
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.8rem;
    }

    .footer-ministry {
      color: var(--gov-gold) !important;
      opacity: 0.6;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .footer-grid {
        grid-template-columns: 1fr;
        gap: 32px;
        text-align: center;
      }

      .footer-title::after {
        right: 50%;
        transform: translateX(50%);
      }

      .footer-links a {
        justify-content: center;
      }

      .footer-contact li {
        justify-content: center;
      }

      .footer-bottom-content {
        flex-direction: column;
        text-align: center;
      }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
