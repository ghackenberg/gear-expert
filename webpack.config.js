import url from 'url'
import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const config = {
    mode: 'development',
    entry: './src/scripts/main.tsx',
    resolve: {
        extensions: ['.js', '.ts', '.tsx']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader'
            },{
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },{
                test: /\.(svg|png|jpe?g|gif)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[hash][ext][query]'
                }
            },{
                test: /\.glb$/,
                type: 'asset/resource',
                generator: {
                    filename: 'models/[hash][ext][query]'
                }
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'scripts/[contenthash].js'
    },
    plugins: [
        new HtmlWebpackPlugin({ title: 'Gear Expert' })
    ]
}

export default config