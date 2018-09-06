<h3><a id="_1____0"></a><em>Задание 1 — найди ошибки</em></h3>
<hr>
<p>Код содержит ошибки разной степени критичности. Некоторые из них — стилистические, а другие — даже не позволят вам запустить приложение. Вам нужно найти все ошибки и исправить их.</p>
<hr>
<p><em><code>cd task-1</code></em><br>
<em><code>yarn install</code></em><br>
<em><code>nvm use 9</code></em> - переключаемся на node.js 9.<br>
<em><code>yarn start</code></em><br>
<em><code>http://localhost:9000/</code></em></p>
<hr>
<ol>
<li>
<p>В проект добавлен <em><code>eslint</code></em> с конфигом <em><code>airbnb</code></em>. Исправлены синтаксические ошибки.</p>
</li>
<li>
<p>В <em><code>index.html</code></em> скрипты перенесены из <em><code>body</code></em> в <em><code>head</code></em> (В соответствии с Шаг 1 <em><a href="https://tech.yandex.ru/maps/doc/jsapi/2.1/quick-start/index-docpage/">https://tech.yandex.ru/maps/doc/jsapi/2.1/quick-start/index-docpage/</a></em>). В <em><code>index.css</code></em> задаем размеры для <em><code>#map</code> - <code>width: 100%; height: 100%;</code></em> На экране появляется карта без объектов. При этом во вкладке Network (chrome) уже виден успешный запрос к api (<em><a href="http://localhost:9000/api/stations">http://localhost:9000/api/stations</a></em>) и данные о станциях получены.</p>
</li>
<li>
<p>В <em><code>index.js</code></em> вызывается единственная функция - <em><code>initMap()</code></em> из <em><code>map.js</code></em>. Идем в доку по ObjectManager (<em><a href="https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/ObjectManager-docpage/">https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/ObjectManager-docpage/</a></em>). В примерах 2 и 3 - ‘Добавление массива точечных объектов’ видно, что объекты добавляются 2мя строчками: <em><code>myObjectManager.add(myObjects); map.geoObjects.add(objectManager);</code></em><br>
Добавляем <em><code>myMap.geoObjects.add(objectManager)</code></em> после <em><code>//details</code></em> и переносим туда же <em><code>loadList().then((data) =&gt; {objectManager.add(data)})</code></em>.<br>
На карте появляются объекты, но в неправильном месте.</p>
</li>
<li>
<p>В <em><code>mappers.js</code></em> меняем местами <em><code>obj.long</code></em> и <em><code>obj.lat</code></em>. Теперь все объекты расоложены на карте Мск.<br>
В <em><code>map.js</code></em> удаляем <em><code>objectManager.clusters.options.set('preset', 'islands#greenClusterIcons')</code></em> за ненадобностью.<br>
Также в ObjectManager-е сделал PieChart-ы чуть красивее.<br>
Удаляем весь <em><code>popup.js</code></em>, т.к функция <em><code>getPopupContent()</code></em> в <em><code>popup.js</code></em> нигде не импортируются в отличие от <em><code>getDetailsContentLayout()</code></em> в <em><code>details.js</code></em>.</p>
</li>
<li>
<p>При нажатии на значек станции, карта зависает с ошибкой: <em><code>&quot;Cannot read property 'setPosition' of null&quot;</code></em>. Чтобы понять на какой строке все падает, расставляем <em><code>console.log()</code></em><em>-и</em> в <em><code>//details map.js</code></em> и <em><code>details.js</code></em>. Проблема со стрелочными функциями <em><code>build: () =&gt; {...}</code></em> и <em><code>clear: () =&gt; {...}</code></em> в <em><code>details.js</code></em>. Переписываем их наподобие того как это сделано в примере (<a href="https://tech.yandex.ru/maps/jsbox/2.1/placemark_balloon_layout/">https://tech.yandex.ru/maps/jsbox/2.1/placemark_balloon_layout/</a>), т.е: <em><code>build: function build() {...}</code></em> и <em><code>clear: function clear() {...}</code></em>. Теперь попап с информацией о станции появляется, но без графика нагрузки.</p>
</li>
<li></li>
</ol>
<ul>
<li>В <em><code>charts.js</code></em>, на стр. 43, <em><code>yAxes: [{ ticks: { beginAtZero: true, max: 0 } }]</code></em>. Делаем, например, <em><code>max: 10</code></em> - график отображается, но отстутсвуют метки на оси X. Из доки Chart.js (<em><a href="http://www.chartjs.org/docs/latest/#creating-a-chart">http://www.chartjs.org/docs/latest/#creating-a-chart</a></em>) следует, что значения для оси Х содержатся в <em><code>data: { labels: [&quot;...&quot;, &quot;...&quot;, &quot;...&quot;, &quot;...&quot;, &quot;...&quot;, &quot;...&quot;, &quot;...&quot;], ... }</code></em>. В нашем случае, это стр.27 - <em><code>labels: data.map(getLabel)</code></em>.</li>
<li>Функция <em><code>getLabel()</code></em> возвращает все параметры даты и времени. Сделаем <em><code>return x.getHours().toString()</code></em>, чтобы получать только часы.</li>
<li>Сделаем <em><code>x.setHours(x.getHours() - data.length + i + 1)</code></em> на стр.11, чтобы получать часы именно до последнего прошедшего часа, а не предпоследнего. Т.е, если теперь нажать на метку станции, например, в 20:30, то <em><code>getLabel()</code></em> вернет уже <em><code>[..., &quot;18&quot;, &quot;19&quot;, &quot;20&quot;]</code></em>, а не <em><code>[..., &quot;17&quot;, &quot;18&quot;, &quot;19&quot;]</code></em>.</li>
<li>Создадим метки на оси Х, следуя данному примеру: <em><a href="https://www.chartjs.org/docs/latest/axes/labelling.html#creating-custom-tick-formats">https://www.chartjs.org/docs/latest/axes/labelling.html#creating-custom-tick-formats</a></em>. Стр.42 тогда примет вид: <em><code>xAxes: [{ ticks: { callback: label =&gt; (``${label}:00``) } }],</code></em></li>
<li>Изменим стр.43 на <em><code>yAxes: [{ ticks: { beginAtZero: true, max: Math.max.apply(null, data) } }]</code></em>, чтобы максимальное значение по оси Y ограничивалось макисмальным значением <code>data</code> - массива, содержащего данные о нагрузке для данной станции.</li>
</ul>
<ol start="7">
<li>Чуть подчистил <em><code>.eslintrc</code></em></li>
</ol>