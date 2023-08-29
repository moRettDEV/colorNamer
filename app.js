const fs = require('fs');
const axios = require('axios');

async function getColorInfo(hexCode) {
    try {
        const response = await axios.get(`https://www.thecolorapi.com/id?hex=${hexCode}`);
        const colorData = response.data;

        // Преобразуем название цвета в снейккейс
        const snakeCaseName = colorData.name.value.replace(/\s+/g, '_').toLowerCase();

        // Создаем XML-строку для цвета
        const xmlColor = `<color name="android_${snakeCaseName}">#${hexCode}</color>`;

        return xmlColor;
    } catch (error) {
        console.error('Произошла ошибка:', error.message);
        return '';
    }
}

async function generateXmlColors(hexColors) {
    const xmlColors = [];

    for (const hexColor of hexColors) {
        const cleanHex = hexColor.replace("#", "");
        const xmlColor = await getColorInfo(cleanHex);
        xmlColors.push(xmlColor);
    }

    return xmlColors;
}

const hexColorArray = ["#cb2b2b", "#37b24d", "#ffa502"];
generateXmlColors(hexColorArray)
    .then(xmlColors => {
        const xmlString = xmlColors.join('\n');
        const fileName = "android_colors.xml";

        // Записываем XML-строку в файл
        fs.writeFileSync(fileName, xmlString);

        console.log(`Файл "${fileName}" успешно создан.`);
    })
    .catch(error => {
        console.error('Произошла ошибка:', error.message);
    });
