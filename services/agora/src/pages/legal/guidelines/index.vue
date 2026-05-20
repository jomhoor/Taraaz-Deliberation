<template>
  <div>
    <Teleport v-if="isActive" to="#page-header">
      <StandardMenuBar :title="t('guidelines')" :center-content="true" />
    </Teleport>

    <article v-if="isFarsi" class="guidelines-content" dir="rtl">
      <section>
        <h2>۱. اصول اعتدال</h2>
        <p>
          شبکه شهروندی تراز فضایی برای گفتگوهای سیاسی و اجتماعی آزاد و سازنده است.
          برای اطمینان از محیطی منصفانه، محترمانه و فراگیر، سیستم اعتدال ما از این اصول پیروی می‌کند:
        </p>
        <ul>
          <li><strong>شفافیت:</strong> تمام اقدامات اعتدال ثبت و قابل بررسی عمومی هستند.</li>
          <li><strong>فراگیری:</strong> دیدگاه‌های متنوع خوش‌آمد هستند، مشروط بر اینکه از گفتمان محترمانه پیروی کنند.</li>
          <li><strong>قابلیت تأیید:</strong> کاربران می‌توانند تاریخچه اعتدال را بررسی و از تصمیمات تجدیدنظر خواهی کنند.</li>
        </ul>
      </section>

      <section>
        <h2>۲. معیارهای جامعه</h2>
        <p>برای شرکت در تراز، کاربران باید از این راهنماها پیروی کنند:</p>

        <h3>۲.۱ گفتگوی محترمانه</h3>
        <ul>
          <li>با احترام متقابل در بحث‌ها شرکت کنید.</li>
          <li>حملات شخصی، توهین یا آزار و اذیت ممنوع است.</li>
          <li>اختلاف نظرها باید به صورت سازنده ابراز شوند.</li>
        </ul>

        <h3>۲.۲ ممنوعیت سخنان نفرت‌انگیز یا افراط‌گرایی</h3>
        <ul>
          <li>محتوای ترویج‌دهنده نژادپرستی، تبعیض جنسیتی، بیگانه‌هراسی، همجنس‌گراهراسی یا تبعیض ممنوع است.</li>
          <li>دفاع از خشونت، افراط‌گرایی یا رادیکالیسم ممنوع است.</li>
        </ul>

        <h3>۲.۳ ممنوعیت اطلاعات غلط یا دستکاری</h3>
        <ul>
          <li>انتشار عمدی اطلاعات غلط یا نظریه‌های توطئه ممنوع است.</li>
          <li>استفاده از ربات‌ها، فریب افکار عمومی یا رفتار فریبکارانه ممنوع است.</li>
        </ul>

        <h3>۲.۴ ممنوعیت اسپم یا تبلیغات ناخواسته</h3>
        <ul>
          <li>خودتبلیغی بیش از حد، آگهی‌ها یا محتوای نامرتبط ممنوع است.</li>
          <li>ارسال تکراری محتوای یکسان در بحث‌های مختلف ممنوع است.</li>
        </ul>

        <h3>۲.۵ حفاظت از حریم خصوصی و امنیت</h3>
        <ul>
          <li>اشتراک‌گذاری اطلاعات خصوصی یا شناسایی‌کننده بدون رضایت ممنوع است.</li>
          <li>دوکسینگ، تهدید یا تحریک به خشونت ممنوع است.</li>
        </ul>
      </section>

      <section>
        <h2>۳. فرآیند اعتدال</h2>

        <h3>۳.۱ اعتدال جامعه و گزارش‌دهی</h3>
        <p>کاربران می‌توانند محتوا را در دسته‌بندی‌های زیر گزارش دهند:</p>
        <ul>
          <li><strong>ضداجتماعی:</strong> محتوای توهین‌آمیز، نفرت‌انگیز یا آزاردهنده.</li>
          <li><strong>گمراه‌کننده:</strong> ادعاهای کاذب یا گمراه‌کننده، محتوای فریبکارانه.</li>
          <li><strong>غیرقانونی:</strong> نقض قوانین یا ترویج فعالیت‌های غیرقانونی.</li>
          <li><strong>دوکسینگ:</strong> اشتراک‌گذاری غیرمجاز اطلاعات خصوصی.</li>
          <li><strong>جنسی:</strong> محتوای صریح جنسی یا نامناسب.</li>
          <li><strong>اسپم:</strong> محتوای تکراری، نامرتبط یا تبلیغاتی.</li>
        </ul>

        <h3>۳.۲ بررسی اعتدال و سیستم تجدیدنظر</h3>
        <ul>
          <li>اقدامات اعتدال (هشدارها، حذف‌ها، تعلیق‌ها) ثبت و قابل بررسی عمومی هستند.</li>
          <li>کاربران می‌توانند از طریق فرآیند بررسی باز از تصمیمات اعتدال تجدیدنظر خواهی کنند.</li>
          <li>نقض‌های مکرر منجر به پیامدهای تشدیدشونده می‌شود.</li>
        </ul>
      </section>

      <section>
        <h2>۴. پیامدهای نقض قوانین</h2>
        <table>
          <thead>
            <tr>
              <th>سطح نقض</th>
              <th>پیامد</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>نقض اول</strong></td>
              <td>هشدار و حذف محتوا.</td>
            </tr>
            <tr>
              <td><strong>نقض دوم</strong></td>
              <td>تعلیق موقت.</td>
            </tr>
            <tr>
              <td><strong>نقض‌های شدید (مانند تهدید، دوکسینگ)</strong></td>
              <td>تعلیق دائم.</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>۵. بازخورد و سازگاری</h2>
        <ul>
          <li>کاربران می‌توانند از طریق سیستم بررسی شفاف از تصمیمات اعتدال تجدیدنظر خواهی کنند.</li>
          <li>بازخورد در مورد سیاست‌های اعتدال تشویق می‌شود و به طور منظم برای سازگاری با نیازهای جامعه بررسی می‌شود.</li>
        </ul>
        <p>
          این راهنماها برای ایجاد فضایی برای بحث‌های معنادار، محترمانه و تأثیرگذار طراحی شده‌اند.
          از اینکه بخشی از شبکه شهروندی تراز هستید، متشکریم!
        </p>
        <p>
          اگر سؤال یا نگرانی‌ای درباره راهنمای جامعه ما دارید، با ما از طریق
          <a href="mailto:legal@zkorum.com">legal@zkorum.com</a>
          تماس بگیرید.
        </p>
      </section>
    </article>

    <article v-else class="guidelines-content">
      <section>
        <h2>1. Principles of Moderation</h2>
        <p>
          Agora Citizen Network is a space for open and constructive political and social discussions.
          To ensure a fair, respectful, and inclusive environment, our moderation system follows these
          principles:
        </p>
        <ul>
          <li><strong>Transparency:</strong> All moderation actions are logged and publicly reviewable.</li>
          <li><strong>Inclusivity:</strong> Diverse perspectives are welcome, provided they adhere to respectful discourse.</li>
          <li><strong>Verifiability:</strong> Users can review moderation history and appeal decisions.</li>
        </ul>
      </section>

      <section>
        <h2>2. Community Standards</h2>
        <p>To participate in Agora, users must follow these guidelines:</p>

        <h3>2.1 Respectful Discourse</h3>
        <ul>
          <li>Engage in discussions with mutual respect.</li>
          <li>No personal attacks, insults, or harassment.</li>
          <li>Disagreements should be expressed constructively.</li>
        </ul>

        <h3>2.2 No Hate Speech or Extremism</h3>
        <ul>
          <li>No content promoting racism, sexism, xenophobia, homophobia, or discrimination.</li>
          <li>No advocacy of violence, extremism, or radicalization.</li>
        </ul>

        <h3>2.3 No Misinformation or Manipulation</h3>
        <ul>
          <li>No intentional spreading of false information or conspiracy theories.</li>
          <li>No use of bots, astroturfing, or deceptive behavior.</li>
        </ul>

        <h3>2.4 No Spam or Unsolicited Promotions</h3>
        <ul>
          <li>No excessive self-promotion, ads, or irrelevant content.</li>
          <li>No repetitive posting of the same content across discussions.</li>
        </ul>

        <h3>2.5 Privacy and Safety Protection</h3>
        <ul>
          <li>No sharing of private or personally identifiable information without consent.</li>
          <li>No doxxing, threats, or incitement to violence.</li>
        </ul>
      </section>

      <section>
        <h2>3. Moderation Process</h2>

        <h3>3.1 Community Moderation & Reporting</h3>
        <p>Users can report content under the following categories:</p>
        <ul>
          <li><strong>Antisocial:</strong> Offensive, hateful, or targeted harassment.</li>
          <li><strong>Misleading:</strong> False or misleading claims, deceptive content.</li>
          <li><strong>Illegal:</strong> Violations of laws or promotion of illegal activities.</li>
          <li><strong>Doxxing:</strong> Unauthorized sharing of private information.</li>
          <li><strong>Sexual:</strong> Sexually explicit or inappropriate material.</li>
          <li><strong>Spam:</strong> Repetitive, off-topic, or promotional content.</li>
        </ul>

        <h3>3.2 Moderation Review & Appeal System</h3>
        <ul>
          <li>Moderation actions (warnings, removals, suspensions) are logged and publicly reviewable.</li>
          <li>Users may appeal moderation decisions through an open review process.</li>
          <li>Repeated violations result in escalating consequences.</li>
        </ul>
      </section>

      <section>
        <h2>4. Consequences for Violations</h2>
        <table>
          <thead>
            <tr>
              <th>Violation Level</th>
              <th>Consequence</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>First Violation</strong></td>
              <td>Warning and content removal.</td>
            </tr>
            <tr>
              <td><strong>Second Violation</strong></td>
              <td>Temporary suspension.</td>
            </tr>
            <tr>
              <td><strong>Severe Violations (e.g., threats, doxxing)</strong></td>
              <td>Permanent suspension.</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>5. Feedback & Adaptation</h2>
        <ul>
          <li>Users may appeal moderation decisions through a transparent review system.</li>
          <li>Feedback on moderation policies is encouraged and reviewed regularly to adapt to community needs.</li>
        </ul>
        <p>
          These guidelines are designed to foster a space for meaningful, respectful, and impactful discussions.
          Thank you for being a part of Agora Citizen Network!
        </p>
        <p>
          If you have any questions or concerns about our Community Guidelines, please contact us at
          <a href="mailto:legal@zkorum.com">legal@zkorum.com</a>.
        </p>
      </section>
    </article>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from "quasar";
import { StandardMenuBar } from "src/components/navigation/header/variants";
import { usePageLayout } from "src/composables/layout/usePageLayout";
import { useComponentI18n } from "src/composables/ui/useComponentI18n";

import {
  type GuidelinesTranslations,
  guidelinesTranslations,
} from "./index.i18n";

const { isActive } = usePageLayout({ reducedWidth: true });

const { t } = useComponentI18n<GuidelinesTranslations>(
  guidelinesTranslations
);
const $q = useQuasar();
const isFarsi = computed(() => $q.lang.rtl === true);
</script>

<style scoped lang="scss">
.guidelines-content {
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;

  h2 {
    margin-top: 2rem;
    margin-bottom: 1rem;
    font-size: 1.5rem;
    font-weight: 600;
  }

  h3 {
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    font-size: 1.2rem;
    font-weight: 600;
  }

  section {
    margin-bottom: 2rem;
  }

  p {
    margin-bottom: 1rem;
  }

  ul,
  ol {
    margin-bottom: 1rem;
    padding-left: 1.5rem;

    li {
      margin-bottom: 0.5rem;
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1.5rem;

    th, td {
      border: 1px solid #ddd;
      padding: 0.75rem;
      text-align: left;
      vertical-align: top;
    }

    th {
      background-color: rgba($primary, 0.1);
      font-weight: 600;
    }
  }

  address {
    font-style: normal;
    margin-top: 1rem;
  }

  a {
    color: $primary;
    text-decoration: underline;

    &:hover {
      opacity: 0.8;
    }
  }
}
</style>
