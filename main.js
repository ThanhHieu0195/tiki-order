const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
console.info("params", params);
const jsonFile = params.jsonFile || "data";

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function formatPrice(price) {
  return Number(price).toLocaleString().replace(/,/g, ".");
}

function taxPrice({ price }) {
  return (Number(price) * 10) / 100;
}

function totalPrice(item) {
  return taxPrice(item) + Number(item.price);
}

(async function ($) {
  console.log("main.js loaded");
  const result = await fetch("api/" + jsonFile + ".json");
  const dataInfo = await result.json();
  $("span:contains('{{buyerName}}')").html(params.name || dataInfo.buyer.name);
  $("span:contains('{{buyerAddress}}')").html(
    params.address || dataInfo.buyer.address
  );
  $("span:contains('{{buyerPhone}}')").html(
    params.phone || dataInfo.buyer.phone
  );

  $("span:contains('{{orderDay}}')").html(dataInfo.order.day);
  $("span:contains('{{orderMonth}}')").html(dataInfo.order.month);
  $("span:contains('{{orderYear}}')").html(dataInfo.order.year);

  $("b:contains('{{orderNumber}}')").html(makeid(10).toUpperCase());
  $("b:contains('{{orderNo}}')").html(
    Math.round(Math.random() * Math.pow(10, 7))
  );

  let idx = 1;
  let totalPrice = 0;
  let totalTax = 0;
  let totalPriceWithTax = 0;
  for (const item of dataInfo.items) {
    const { price, num } = item;
    const totalItemPrice = price * num;
    const tax = (totalItemPrice * 10) / 100;
    const totalItemPriceWithTax = totalItemPrice + tax;

    totalPrice += totalItemPrice;
    totalTax += tax;
    totalPriceWithTax += totalItemPriceWithTax;

    $("#mainTableBody").append(`
    <tr class="boderleftrighyS">
              <td class="text-center" width="30" align="center">
                <p style="margin: 2px 2px">${idx}</p>
              </td>
              <td class="tdFixBD">
                <p style="margin: 2px 2px; line-height: 13px">
                  ${item.name}
                </p>
              </td>
              <td class="text-center">
                <p style="margin: 2px 2px">${item.unit}</p>
              </td>
              <td class="text-center">
                <p style="margin: 2px 2px">${item.num}</p>
              </td>
              <td class="text-right">
                <p style="margin: 2px 2px">${formatPrice(price)}</p>
              </td>
              <td class="text-right">
                <p style="margin: 2px 2px">0</p>
              </td>
              <td class="text-right">
                <p style="margin: 2px 2px">${formatPrice(totalItemPrice)}</p>
              </td>
              <td class="text-center">
                <p style="margin: 2px 2px">10%</p>
              </td>
              <td class="text-right">
                <p style="margin: 2px 2px">${formatPrice(tax)}</p>
              </td>
              <td class="text-right">
                <p style="margin: 2px 2px">${formatPrice(
                  totalItemPriceWithTax
                )}</p>
              </td>
            </tr>
    `);
    idx++;
  }

  $("span:contains('{{totalPrice}}')").html(formatPrice(totalPrice));
  $("span:contains('{{totalPriceWithTax}}')").html(
    formatPrice(totalPriceWithTax)
  );
  $("span:contains('{{totalTax}}')").html(formatPrice(totalTax));

  $("span:contains('{{textTotalPriceWithTax}}')").html(
    readMoney(String(totalPriceWithTax).replace(/\./g, ""))
  );
})(jQuery);
