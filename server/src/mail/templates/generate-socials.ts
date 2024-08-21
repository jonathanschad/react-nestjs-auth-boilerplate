export const generateSocials = (socials: { name: string; url: string }[]) => {
    return socials
        .map((social) => {
            return `
            <td
                style="
                    overflow-wrap: break-word;
                    word-break: break-word;
                    padding: 25px 10px 10px;
                    font-family: 'Lato', sans-serif;
                "
                align="left"
            >
                <div align="left">
                    <div style="display: table; max-width: 187px">
                        <!--[if (mso)|(IE)]><table width="187" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-collapse:collapse;" align="left"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; mso-table-lspace: 0pt;mso-table-rspace: 0pt; width:187px;"><tr><![endif]-->

                        <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 15px;" valign="top"><![endif]-->

                        <!--[if (mso)|(IE)]></td><![endif]-->

                        <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 15px;" valign="top"><![endif]-->

                        <!--[if (mso)|(IE)]></td><![endif]-->

                        <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 15px;" valign="top"><![endif]-->

                        <!--[if (mso)|(IE)]></td><![endif]-->

                        <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 0px;" valign="top"><![endif]-->
                        <table
                            align="left"
                            border="0"
                            cellspacing="0"
                            cellpadding="0"
                            width="32"
                            height="32"
                            style="
                                width: 32px !important;
                                height: 32px !important;
                                display: inline-block;
                                border-collapse: collapse;
                                table-layout: fixed;
                                border-spacing: 0;
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                vertical-align: top;
                                margin-right: 0px;
                            "
                        >
                            <tbody>
                                <tr style="vertical-align: top">
                                    <td
                                        align="left"
                                        valign="middle"
                                        style="
                                            word-break: break-word;
                                            border-collapse: collapse !important;
                                            vertical-align: top;
                                        "
                                    >
                                        <a
                                            href="${social.url}"
                                            title="${social.name}"
                                            target="_blank"
                                        >
                                            <img
                                                src="cid:${social.name}"
                                                alt="${social.url}"
                                                title="${social.url}"
                                                width="32"
                                                style="
                                                    outline: none;
                                                    text-decoration: none;
                                                    -ms-interpolation-mode: bicubic;
                                                    clear: both;
                                                    display: block !important;
                                                    border: none;
                                                    height: auto;
                                                    float: none;
                                                    max-width: 32px !important;
                                                "
                                            />
                                        </a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <!--[if (mso)|(IE)]></td><![endif]-->

                        <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                    </div>
                </div>
            </td>
                `;
        })
        .join('');
};
