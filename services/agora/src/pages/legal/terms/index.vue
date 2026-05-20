<template>
  <div>
    <Teleport v-if="isActive" to="#page-header">
      <StandardMenuBar :title="t('termsOfService')" :center-content="true" />
    </Teleport>

    <article v-if="isFarsi" class="terms-content" dir="rtl">
      <p><strong>آخرین به‌روزرسانی:</strong> ۱۴۰۴/۰۷/۱۵</p>

      <p>
        به شبکه شهروندی تراز («تراز») خوش آمدید! این شرایط و ضوابط («شرایط») دسترسی و استفاده شما از پلتفرم تراز، از جمله وب‌سایت، برنامه‌های موبایل و سایر خدمات آن (مجموعاً «خدمات») را تنظیم می‌کند. با دسترسی یا استفاده از خدمات، موافقت خود با این شرایط را اعلام می‌کنید. در صورت عدم موافقت، حق دسترسی یا استفاده از خدمات را ندارید.
      </p>

      <section>
        <h2>۱. دسترسی شما به خدمات</h2>
        <p>
          تراز تنها برای کاربران ۱۶ سال به بالا در دسترس است. با استفاده از تراز، تأیید می‌کنید که این شرط سنی را دارید و بالاتر از حداقل سن مجاز قانونی کشور محل اقامتتان برای دسترسی و استفاده از خدمات هستید.
        </p>
        <p>
          برای مرور تراز نیازی به ایجاد حساب کاربری ندارید. با این حال، برای شرکت در بحث‌ها و تعامل با محتوا («محتوا»)، ممکن است لازم باشد با یکی از روش‌های زیر ثبت‌نام کنید:
        </p>
        <ul>
          <li>ورود با شماره تلفن (تأیید از طریق کد یک‌بار مصرف)</li>
          <li>
            ورود از طریق اثبات رمزنگاری از برنامه‌های تأیید هویت شخص ثالث (Rarimo، Zupass)، که هویت شما را با استفاده از اثبات‌های دانش صفر (ZKP) تأیید می‌کنند. توجه داشته باشید که ثبت‌نام از طریق
            <a href="https://rarimo.com/general-terms.html" target="_blank" rel="noopener noreferrer">Rarimo</a>
            برای افراد زیر ۱۸ سال امکان‌پذیر نیست.
          </li>
        </ul>
        <p>در صورتی که از خدمات نباید استفاده کنید:</p>
        <ul>
          <li>از تراز تعلیق یا اخراج شده باشید.</li>
          <li>استفاده از خدمات در حوزه قضایی شما از نظر قانونی ممنوع باشد.</li>
          <li>نتوانید با تراز قرارداد الزام‌آور منعقد کنید، یا در صورتی که زیر سن رشد قانونی در حوزه قضایی خود هستید، مگر اینکه سرپرست قانونی شما این شرایط را مرور و با آن موافقت کرده باشد.</li>
        </ul>
      </section>

      <section>
        <h2>۲. سیاست حریم خصوصی</h2>
        <p>
          سیاست حریم خصوصی تراز توضیح می‌دهد که چگونه داده‌های شخصی شما را جمع‌آوری، استفاده و حفاظت می‌کنیم. با استفاده از خدمات، رضایت خود را برای جمع‌آوری و پردازش اطلاعاتتان طبق سیاست حریم خصوصی اعلام می‌کنید. برای جزئیات بیشتر، به
          <a href="/legal/privacy">سیاست حریم خصوصی تراز</a>
          مراجعه کنید.
        </p>
      </section>

      <section>
        <h2>۳. استفاده شما از خدمات</h2>
        <p>
          با توجه به این شرایط، تراز به شما مجوز غیرانحصاری، غیرقابل انتقال و قابل لغو برای استفاده از خدمات اعطا می‌کند. شما مجاز به موارد زیر نیستید:
        </p>
        <ul>
          <li>استفاده از تراز برای انتشار اطلاعات غلط، سخنان نفرت‌انگیز یا آزار و اذیت.</li>
          <li>انجام فعالیت‌های غیرقانونی.</li>
          <li>انجام یا ترویج فعالیت‌های تقلبی، کلاهبرداری یا رویه‌های فریبکارانه.</li>
          <li>توزیع یا ترویج محتوای صریح جنسی، خشونت‌آمیز یا نامناسب.</li>
          <li>تعقیب، ارعاب یا تهدید افراد یا گروه‌ها.</li>
          <li>تلاش برای دستکاری یا بهره‌برداری از پلتفرم، الگوریتم‌ها یا ویژگی‌های تراز برای سود شخصی یا تجاری.</li>
          <li>انجام فعالیت‌هایی که آسیب به خود، خودکشی یا هر شکلی از به خطر انداختن را ترویج می‌دهند.</li>
          <li>نقض حقوق مالکیت فکری، از جمله توزیع غیرمجاز مواد دارای حق چاپ.</li>
          <li>اجازه‌دهی، فروش، انتقال، واگذاری، توزیع، میزبانی یا بهره‌برداری تجاری از خدمات یا محتوا.</li>
          <li>تلاش برای هک، اختلال یا مهندسی معکوس زیرساخت تراز.</li>
          <li>استفاده از ابزارهای خودکار برای جمع‌آوری یا استخراج محتوا.</li>
          <li>جعل هویت کاربر، نهاد یا سازمان دیگری.</li>
          <li>اشتراک‌گذاری یا توزیع نرم‌افزار مخرب، تلاش‌های فیشینگ یا طرح‌های تقلبی.</li>
          <li>نقض حریم خصوصی کاربران دیگر با افشای اطلاعات شخصی یا حساس بدون رضایت.</li>
        </ul>
        <p>
          تراز حق تغییر یا حذف ویژگی‌ها را در هر زمان بدون اطلاع قبلی حفظ می‌کند. هرگونه پیشرفت، به‌روزرسانی یا اضافه‌سازی آینده به خدمات، تحت این شرایط اداره خواهد شد.
        </p>
      </section>

      <section>
        <h2>۴. محتوای شما</h2>
        <p>
          خدمات ممکن است شامل انواع مختلفی از محتوا باشند، از جمله متن، پیوندها، تصاویر، ویدئوها، صدا و سایر مواد ارسال‌شده توسط کاربران («محتوا»). تراز صحت، کامل بودن یا قابلیت اطمینان هیچ محتوایی را تضمین نمی‌کند و هیچ مسئولیتی در قبال آن نمی‌پذیرد.
        </p>
        <p>
          با ارسال محتوا، تأیید می‌کنید که تمام حقوق لازم برای اشتراک‌گذاری آن را دارید و هیچ قانون یا حقوق شخص ثالثی را نقض نمی‌کند. شما مسئولیت انحصاری محتوای خود و هر پیامدی ناشی از اشتراک‌گذاری آن در تراز را بر عهده دارید.
        </p>
        <p>
          با استفاده از خدمات، مالکیت محتوای خود را حفظ می‌کنید اما به تراز مجوز جهانی، غیرانحصاری، بدون حق‌الامتیاز، دائمی و قابل انتقال برای ذخیره، استفاده، تغییر، توزیع و نمایش محتوای شما برای اهداف عملکردی پلتفرم اعطا می‌کنید.
        </p>
        <p>
          تراز حق حذف یا محدود کردن محتوا را بنا به صلاحدید خود در صورت نقض این شرایط، قوانین قابل اجرا یا سیاست‌های پلتفرم حفظ می‌کند.
        </p>
      </section>

      <section>
        <h2>۵. سیاست‌های محتوا و اعتدال</h2>
        <p>شما نباید محتوایی ارسال کنید که:</p>
        <ul>
          <li>خشونت یا فعالیت‌های غیرقانونی را ترویج می‌دهد.</li>
          <li>حاوی سخنان نفرت‌انگیز، آزار و اذیت یا حملات شخصی است.</li>
          <li>اطلاعات غلط یا محتوای دستکاری‌شده را منتشر می‌کند.</li>
          <li>حقوق مالکیت فکری را نقض می‌کند.</li>
        </ul>
        <p>
          تراز از یک سیستم اعتدال محتوا بر اساس گزارش‌های کاربران، تشخیص خودکار و
          <a href="/legal/guidelines">راهنمای جامعه</a>
          استفاده می‌کند. محتوایی که این شرایط را نقض کند ممکن است حذف شود و متخلفان مکرر ممکن است با تعلیق یا ممنوعیت مواجه شوند.
        </p>
        <p>
          برای گزارش محتوای غیرقانونی یا رسیدگی به نگرانی‌های اعتدال و قانونی، لطفاً با ما از طریق
          <a href="mailto:admin@jomhoor.org">admin@jomhoor.org</a>
          تماس بگیرید.
        </p>
      </section>

      <section>
        <h2>۶. محتوای شخص ثالث و تبلیغات</h2>
        <p>
          تراز ممکن است حاوی پیوندهایی به وب‌سایت‌ها، محصولات یا خدمات شخص ثالث باشد. تراز هیچ کنترل، تأییدیه یا مسئولیتی در قبال دقت، قانونی بودن یا قابلیت اطمینان چنین منابع خارجی ندارد.
        </p>
      </section>

      <section>
        <h2>۷. مالکیت فکری</h2>
        <p>
          تمام مالکیت فکری مرتبط با تراز، از جمله پتنت‌ها، علائم تجاری، حق‌های نشر، اسرار تجاری و نرم‌افزار — چه ثبت‌شده و چه ثبت‌نشده — متعلق به تراز است یا توسط آن مجوز دریافت شده است.
        </p>
        <p>
          استفاده، تکثیر، تغییر، توزیع یا بهره‌برداری غیرمجاز از مالکیت فکری تراز به شدت ممنوع است.
        </p>
      </section>

      <section>
        <h2>۸. پایان خدمات</h2>
        <p>
          شما می‌توانید در هر زمان و به هر دلیلی این شرایط را با حذف حساب خود و قطع استفاده از تمام خدمات، فسخ کنید.
        </p>
        <h3>نحوه حذف حساب:</h3>
        <ul>
          <li>
            اگر حساب خود را با استفاده از Rarimo (تأیید پاسپورت) تأیید کرده‌اید، باید قبل از اقدام به حذف، یک اثبات جدید حاوی تنها شناسه منحصربه‌فرد (بدون ملیت و جنسیت) ایجاد کنید.
          </li>
          <li>
            اگر حساب خود را تنها با شماره تلفن تأیید کرده‌اید، باید شماره تلفن خود را مجدداً تأیید کنید تا حذف حساب تکمیل شود.
          </li>
          <li>در صورت موفقیت، حساب شما ظرف ۳۰ روز حذف خواهد شد.</li>
        </ul>
        <p>
          برخی سوابق رمزنگاری حتی پس از حذف حساب برای اطمینان از پاسخگویی حفظ خواهند شد.
        </p>
        <p>
          تراز حق تعلیق یا پایان دادن به حساب‌هایی که این شرایط را نقض می‌کنند را حفظ می‌کند.
        </p>
      </section>

      <section>
        <h2>۹. سلب مسئولیت و محدودیت مسئولیت</h2>
        <p>
          خدمات «همان‌طور که هست» ارائه می‌شوند بدون هیچ‌گونه ضمانتی. تراز هیچ ضمانتی ارائه نمی‌دهد که خدمات عاری از خطا، بدون وقفه یا ایمن خواهند بود.
        </p>
        <p>
          تا حداکثر مجاز توسط قانون، تراز مسئولیتی در قبال هیچ‌گونه خسارت غیرمستقیم، تبعی، تنبیهی یا ویژه ناشی از استفاده شما از خدمات ندارد.
        </p>
        <p>
          در حالی که تراز از فناوری اثبات دانش صفر (ZKP) برای بهبود حریم خصوصی و امنیت استفاده می‌کند، کاربران می‌پذیرند که هیچ فناوری‌ای بی‌نقص نیست.
        </p>
      </section>

      <section>
        <h2>۱۰. غرامت</h2>
        <p>
          به جز در مواردی که قانون منع کرده، موافقت می‌کنید تراز، وابستگان آن و مدیران، کارمندان و نمایندگان مربوطه را در برابر هرگونه ادعا، تقاضا، مسئولیت، خسارت، زیان و هزینه ناشی از استفاده شما از تراز و خدمات، نقض این شرایط یا نقض هر قانون قابل اجرا دفاع، جبران و بی‌خطر نگه دارید.
        </p>
      </section>

      <section>
        <h2>۱۱. تفکیک‌پذیری</h2>
        <p>
          در صورتی که هر یک از مفاد این شرایط نامعتبر یا غیرقابل اجرا یافت شود، سایر مفاد به قوت خود باقی خواهند ماند.
        </p>
      </section>

      <section>
        <h2>۱۲. قانون حاکم و حل اختلاف</h2>
        <p>
          این شرایط تحت قوانین فرانسه تنظیم و تفسیر می‌شوند. در صورت بروز اختلاف، ابتدا تلاش کنید آن را به صورت غیررسمی با ما حل کنید از طریق
          <a href="mailto:admin@jomhoor.org">admin@jomhoor.org</a>.
          اختلافاتی که به صورت غیررسمی قابل حل نباشند در صلاحیت انحصاری دادگاه‌های نویی‌سور‌سن خواهند بود.
        </p>
      </section>

      <section>
        <h2>۱۳. تغییرات در این شرایط</h2>
        <p>
          تراز ممکن است این شرایط را به‌روزرسانی کند. در صورت ایجاد تغییرات قابل توجه، کاربران از طریق اعلان‌های درون‌برنامه‌ای آگاه خواهند شد.
        </p>
      </section>

      <section>
        <h2>۱۴. متفرقه</h2>
        <p>
          این شرایط، به همراه سیاست حریم خصوصی، توافق کامل حاکم بر دسترسی و استفاده شما از تراز را تشکیل می‌دهند.
        </p>
      </section>

      <section>
        <h2>۱۵. اطلاعات تماس</h2>
        <p>
          برای سؤالات یا نگرانی‌های مربوط به این شرایط، با ما تماس بگیرید:
          <a href="mailto:admin@jomhoor.org">admin@jomhoor.org</a>
        </p>
        <p>
          با استفاده از تراز، این شرایط و هرگونه تغییر آتی را می‌پذیرید.
        </p>
        <address>
          ZKORUM SAS<br />
          99 AVENUE ACHILLE PERETTI<br />
          92200 NEUILLY-SUR-SEINE<br />
          FRANCE
        </address>
      </section>
    </article>

    <article v-else class="terms-content">
      <p><strong>Last updated on</strong>: 2025/10/07 (YYYY/MM/DD)</p>

      <p>
        Welcome to Jomhoor ("Jomhoor")! These Terms and Conditions
        ("Terms") govern your access to and use of the Jomhoor platform, including
        our website, mobile applications and other services (collectively, the
        "Services"). By accessing or using the Services, you agree to be bound
        by these Terms. If you do not agree, you may not access or use the
        Services.
      </p>

      <section>
        <h2>1. Your access to the services</h2>
        <p>
          Jomhoor is only available to users aged 16 years or older. By using
          Jomhoor, you confirm that you meet this age requirement and that you are
          over the minimum age required by the laws of your country of residence
          to access and use the Services.
        </p>
        <p>
          You are not required to create an account to browse Jomhoor. However, to
          participate in discussions and interact with content ("Content"), you
          may need to register using one of the following methods:
        </p>
        <ul>
          <li>Log-in via phone number (verified through a one-time code)</li>
          <li>
            Log-in via cryptographic proof from third-party verification apps
            (Rarimo, Zupass), which verify your identity using Zero-Knowledge
            Proofs (ZKP). These methods ensure that your identity is validated
            while maintaining privacy. Jomhoor receives only cryptographic proofs
            confirming uniqueness and eligibility, never the underlying identity
            documents or ticket information. Note that it is not possible to
            register via
            <a
              href="https://rarimo.com/general-terms.html"
              target="_blank" 
              rel="noopener noreferrer"
              >Rarimo</a
            >
            if you're not 18 years or older.
          </li>
        </ul>
        <p>You must not use the Services if:</p>
        <ul>
          <li>You have been suspended or removed from Jomhoor.</li>
          <li>
            You are legally prohibited from using the Services in your
            jurisdiction.
          </li>
          <li>
            You cannot form a binding contract with Jomhoor, or if you are under
            the age of majority in your jurisdiction, unless your legal guardian
            has reviewed and agreed to these Terms.
          </li>
        </ul>
      </section>

      <section>
        <h2>2. Privacy Policy</h2>
        <p>
          Jomhoor's Privacy Policy explains how we collect, use and protect your
          personal data. By using the Services, you consent to the collection
          and processing of your information as described in the Privacy Policy.
          For more details, visit the
          <a href="/legal/privacy">Jomhoor Privacy Policy</a>.
        </p>
      </section>

      <section>
        <h2>3. Your use of the services</h2>
        <p>
          Subject to these Terms, Jomhoor grants you a non-exclusive,
          non-transferable, revocable license to use the Services. You may not:
        </p>
        <ul>
          <li>
            Use Jomhoor to spread misinformation, hate speech or harassment.
          </li>
          <li>Engage in illegal activities.</li>
          <li>
            Engage in or promote fraudulent activities, scams or deceptive
            practices.
          </li>
          <li>
            Distribute or promote sexually explicit, violent or otherwise
            inappropriate content.
          </li>
          <li>
            Use Jomhoor to stalk, intimidate or threaten individuals or groups.
          </li>
          <li>
            Attempt to manipulate or exploit Jomhoor's platform, algorithms or
            features for personal or commercial gain.
          </li>
          <li>
            Engage in activities that encourage self-harm, suicide or any form
            of endangerment.
          </li>
          <li>
            Violate intellectual property rights, including unauthorized
            distribution of copyrighted material.
          </li>
          <li>
            License, sell, transfer, assign, distribute, host or otherwise
            commercially exploit the Services or Content
          </li>
          <li>
            Attempt to hack, disrupt, or reverse-engineer Jomhoor's
            infrastructure.
          </li>
          <li>Use automated tools to scrape or extract content.</li>
          <li>Impersonate another user, entity or organization.</li>
          <li>
            Share or distribute malicious software, phishing attempts or
            fraudulent schemes.
          </li>
          <li>
            Violate the privacy of other users by disclosing personal or
            sensitive information without consent, including but not limited to
            sharing personal addresses, phone numbers, financial details, or any
            private communications without explicit permission.
          </li>
        </ul>
        <p>
          Jomhoor retains the right to modify or remove features at any time
          without prior notice. Any future enhancements, updates, or additions
          to the Services will be governed by these Terms, which may be revised
          periodically. You acknowledge that Jomhoor is not liable to you or any
          third party for any modifications, suspensions or discontinuations of
          the Services or any of their components.
        </p>
      </section>

      <section>
        <h2>4. Your Content</h2>
        <p>
          The Services may contain various types of content, including text,
          links, images, videos, audio, and other materials submitted by users
          ("Content"). Jomhoor does not guarantee the accuracy, completeness or
          reliability of any Content and assumes no responsibility for it.
        </p>
        <p>
          By submitting Content, you confirm that you have all necessary rights
          to share it and that it does not violate any applicable laws or
          third-party rights. You are solely responsible for your content and
          any consequences arising from sharing it on Jomhoor.
        </p>
        <p>
          By using the Services, you retain ownership of your content but grant
          Jomhoor a worldwide, non-exclusive, royalty-free, perpetual and
          sublicensable license to store, use, modify, distribute and display
          your content for platform functionality, compliance and operational
          purposes. This includes the right for Jomhoor to make your Content
          available for syndication, distribution, aggregation or publication by
          third-party partners.
        </p>
        <p>
          Jomhoor reserves the right to remove or restrict content at its
          discretion if it violates these Terms, applicable laws or platform
          policies.
        </p>
      </section>

      <section>
        <h2>5. Content and moderation policies</h2>
        <p>You may not post Content that:</p>
        <ul>
          <li>Promotes violence or illegal activities.</li>
          <li>Contains hate speech, harassment or personal attacks.</li>
          <li>Spreads misinformation or manipulative content.</li>
          <li>Violates intellectual property rights.</li>
        </ul>
        <p>
          Jomhoor employs a content moderation system based on user reports,
          automated detection and
          <a href="/legal/guidelines">Community Guidelines</a>. Content
          violating these Terms may be removed and repeat offenders may face
          suspension or bans.
        </p>
        <p>
          To report illegal content or address moderation and legal concerns,
          please reach out to us at
          <a href="mailto:admin@jomhoor.org">admin@jomhoor.org</a>.
        </p>
      </section>

      <section>
        <h2>6. Third party content and advertisements</h2>
        <p>
          Jomhoor may contain links to third-party websites, products, or
          services, which may be shared by advertisers, partners, affiliates or
          other users ("Third Party Content"). Jomhoor does not control, endorse
          or assume any responsibility for the accuracy, legality or reliability
          of such external sources.
        </p>
        <p>
          Accessing or engaging with Third Party Content is at your own risk and
          we encourage you to review any relevant terms, policies or conditions
          before interacting with external sources or completing transactions.
        </p>
        <p>
          Jomhoor may display advertisements or sponsored content. The type,
          targeting and frequency of advertisements may change, and we reserve
          the right to place advertisements in connection with any content or
          services provided on Jomhoor. Your interactions with sponsored content
          or advertisements are solely at your own risk, and we do not guarantee
          the accuracy, quality, or legitimacy of any advertised products or
          services.
        </p>
      </section>

      <section>
        <h2>7. Intellectual property</h2>
        <p>
          All intellectual property associated with Jomhoor, including but not
          limited to patents, trademarks, trade names, copyrights, trade
          secrets, proprietary data, know-how, moral rights, database rights,
          design rights, algorithms, software, computer code, visual interfaces
          and any other proprietary rights—whether registered or
          unregistered—are owned or licensed by Jomhoor. This also includes any
          applications or rights to apply for registration of such intellectual
          property under the laws of any jurisdiction.
        </p>
        <p>
          Unauthorized use, reproduction, modification, distribution, or
          exploitation of Jomhoor's intellectual property is strictly prohibited.
          This includes, but is not limited to, reverse-engineering software,
          selling proprietary materials or using any proprietary content without
          prior written permission from Jomhoor.
        </p>
        <p>
          Any infringement of these intellectual property rights may result in
          legal action. Jomhoor reserves all rights not explicitly granted under
          these Terms.
        </p>
      </section>

      <section>
        <h2>8. Termination of the services</h2>
        <p>
          You may terminate these Terms at any time and for any reason by
          deleting your Account and discontinuing use of all Services. If you
          stop using the Services without deactivating your Account, your
          Account may be deactivated due to prolonged inactivity.
        </p>
        <p>
          The following sections will survive any termination of these Terms or
          of your Account:
        </p>
        <ul>
          <li>3. Your use of the Services,</li>
          <li>4. Your Content,</li>
          <li>8. Termination of the Services,</li>
          <li>9. Disclaimers and limitation liability,</li>
          <li>10. Indemnity</li>
          <li>14. Miscellaneous.</li>
        </ul>

        <h3>How to delete your account:</h3>
        <ul>
          <li>
            If you verified your account using Rarimo (passport verification),
            you must generate a new proof containing only the nullifier
            (excluding nationality and sex) before proceeding with deletion.
          </li>
          <li>
            If you verified your account using only a phone number, you must
            re-verify your phone number to confirm and complete the account
            deletion.
          </li>
          <li>Upon success, your account will be deleted within 30 days.</li>
        </ul>

        <h3>
          To delete the passport proof (if a phone number has already been
          entered) but keep your account:
        </h3>
        <ol>
          <li>
            <strong>Generate a new proof with Rarimo:</strong> You'll need to
            create a fresh verification proof, but this time it will contain
            only your nullifier and not your nationality or sex.
          </li>
          <li>
            <strong>Confirm the deletion:</strong> Once confirmed, your previous
            passport proof, including nationality and sex, will be permanently
            deleted.
          </li>
        </ol>

        <p>
          Some cryptographic records will still be kept, even if you delete your
          account, to ensure accountability:
        </p>
        <ul>
          <li>
            The Zero-Knowledge Proof (ZKP) used for deletion, which contains
            only the nullifier and cryptographic data (not nationality or sex).
          </li>
          <li>
            The User Controlled Authorization Network (UCAN) proof that signs
            this ZKP, verifying the request from your device.
          </li>
          <li>
            The UCAN proof confirming the deletion request, ensuring that the
            request was processed correctly.
          </li>
        </ul>
        <p>
          These cryptographic records exist to prove to third-party auditors
          that Jomhoor did not censor accounts or data but rather deleted the
          information only upon user request. This ensures transparency and
          trust in the system.
        </p>
        <p>
          Jomhoor reserves the right to suspend or terminate accounts that violate
          these Terms.
        </p>
      </section>

      <section>
        <h2>9. Disclaimers and limitation of liability</h2>
        <p>
          The Services are provided "as is" without warranties of any kind.
          Jomhoor makes no representations or warranties of any kind, whether
          express, implied, statutory or otherwise, including but not limited to
          warranties of merchantability, fitness for a particular purpose,
          non-infringement or availability of the Services.
        </p>
        <p>
          Jomhoor does not warrant that the Services will be error-free,
          uninterrupted, secure or that defects will be corrected. Users assume
          all risks associated with the use of the Services.
        </p>
        <p>
          To the fullest extent permitted by law, Jomhoor is not responsible for
          any indirect, incidental, consequential, punitive or special damages
          arising out of or related to your use of the Services, whether based
          on contract, tort, strict liability or any other legal theory, even if
          Jomhoor has been advised of the possibility of such damages. This
          includes, but is not limited to, damages for lost profits, loss of
          data, personal injury, property damage or business interruption.
        </p>
        <p>
          Some jurisdictions do not allow the exclusion or limitation of certain
          damages, so some of these limitations may not apply to you.
        </p>
        <p>
          While Jomhoor implements Zero-Knowledge Proof (ZKP) technology to
          enhance privacy and security, users acknowledge that no technology is
          infallible. There may be unforeseen vulnerabilities or flaws in the
          implementation of ZKP that could potentially lead to unauthorized data
          exposure or privacy breaches. Jomhoor makes no guarantees regarding the
          absolute security or reliability of ZKP and assumes no liability for
          any unintended consequences arising from its use.
        </p>
        <p>
          Users are encouraged to take additional precautions, such as using
          anonymity tools like Tor to mask their IP address, avoiding sharing
          excessive personal information in their writing, and being mindful of
          writing styles and shared attributes that could inadvertently reveal
          their identity through correlation with their passport and other
          recorded actions.
        </p>
      </section>

      <section>
        <h2>10. Indemnity</h2>
        <p>
          Except where prohibited by law, you agree to defend, indemnify and
          hold harmless Jomhoor, its affiliates, and their respective directors,
          officers, employees, agents, contractors, third-party service
          providers, and licensors from and against any claims, demands,
          liabilities, damages, losses and expenses (including legal fees and
          costs) arising out of or related to:
        </p>
        <ol type="a">
          <li>your use of Jomhoor and its Services;</li>
          <li>your violation of these Terms;</li>
          <li>your violation of any applicable laws or regulations; or</li>
          <li>any Content you submit, post, or share on Jomhoor.</li>
        </ol>
        <p>
          Jomhoor reserves the right to assume control of the defense of any
          matter for which you are required to indemnify us, and you agree to
          cooperate fully with our defense of such claims. Your indemnification
          obligations will survive any termination or suspension of your use of
          Jomhoor and its Services.
        </p>
      </section>

      <section>
        <h2>11. Severability</h2>
        <p>
          Whenever possible, the provisions of these Terms shall be interpreted
          in such a manner as to be valid and enforceable under the governing
          law. However, if one or more provisions of these Terms are found to be
          invalid, illegal or unenforceable, in whole or in part, the remainder
          of any such provision and of these Terms shall not be affected and
          shall continue in full force and effect as if such invalid, illegal,
          or unenforceable provision had never been contained herein.
        </p>
      </section>

      <section>
        <h2>12. Governing law and dispute resolution</h2>
        <p>
          These Terms, including any issues related to their validity,
          interpretation, enforcement, performance, or termination, as well as
          any disputes arising from tort claims, pre-contractual obligations, or
          extra-contractual liability, shall be governed by and construed in
          accordance with the laws of France. No effect shall be given to any
          other choice of law principles or conflict-of-laws rules that would
          apply the laws of any jurisdiction other than France.
        </p>
        <p>
          We want you to have a positive experience on Jomhoor. If you have any
          issues or disputes, you agree to first attempt to resolve them with us
          informally. You can reach out to us with any feedback or concerns at
          <a href="mailto:admin@jomhoor.org">admin@jomhoor.org</a>.
        </p>
        <p>
          Any disputes that cannot be resolved informally shall be subject to
          the exclusive jurisdiction of the courts of Neuilly Sur Seine.
        </p>
      </section>

      <section>
        <h2>13. Changes to these Terms</h2>
        <p>
          Jomhoor may update these Terms from time to time to reflect changes in
          our services, legal requirements, or other operational needs. If we
          make significant modifications, we will notify users through in-app
          notifications, banners or prompts requiring acknowledgment before the
          changes take effect.
        </p>
        <p>
          By continuing to access or use Jomhoor after the revised Terms take
          effect, you agree to be bound by the updated Terms. If you do not
          agree to the modifications, you must discontinue your use of Jomhoor
          before the changes become effective.
        </p>
        <p>
          We encourage users to review these Terms regularly to stay informed
          about their rights and obligations when using Jomhoor.
        </p>
      </section>

      <section>
        <h2>14. Miscellaneous</h2>
        <p>
          These Terms, along with the Privacy Policy, constitute the entire
          agreement governing your access to and use of Jomhoor. Our failure to
          exercise or enforce any right or provision under these Terms shall not
          be considered a waiver of such right or provision.
        </p>
        <p>
          If any provision of these Terms is found to be invalid or
          unenforceable, it shall be enforced to the maximum extent permissible,
          and the remaining provisions shall continue in full force and effect.
        </p>
        <p>
          You may not assign or transfer any of your rights or obligations under
          these Terms without our prior consent. However, we reserve the right
          to freely assign our rights and obligations under these Terms without
          restriction.
        </p>
      </section>

      <section>
        <h2>15. Contact information</h2>
        <p>
          For questions or concerns regarding these Terms, contact us at:
          <a href="mailto:admin@jomhoor.org">admin@jomhoor.org</a>
        </p>
        <p>
          By using Jomhoor, you acknowledge and agree to these Terms and any
          future modifications.
        </p>
        <address>
          ZKORUM SAS<br />
          99 AVENUE ACHILLE PERETTI<br />
          92200 NEUILLY-SUR-SEINE<br />
          FRANCE
        </address>
      </section>
    </article>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useQuasar } from "quasar";
import { StandardMenuBar } from "src/components/navigation/header/variants";
import { usePageLayout } from "src/composables/layout/usePageLayout";
import { useComponentI18n } from "src/composables/ui/useComponentI18n";

import {
  type TermsOfServiceTranslations,
  termsOfServiceTranslations,
} from "./index.i18n";

const { isActive } = usePageLayout({ reducedWidth: true });

const { t } = useComponentI18n<TermsOfServiceTranslations>(
  termsOfServiceTranslations
);
const $q = useQuasar();
const isFarsi = computed(() => $q.lang.rtl === true);
</script>

<style scoped lang="scss">
.terms-content {
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
